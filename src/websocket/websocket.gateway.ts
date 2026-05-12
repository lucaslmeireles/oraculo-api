import { MatchmakingService } from 'src/matchmaking/matchmaking.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { SocketEvent } from './websocket.events';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ModerationService } from 'src/moderation/moderation.service';

@WebSocketGateway()
export class SessionGateway implements OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  constructor(
    private session: SessionsService,
    private match: MatchmakingService,
    private moderation: ModerationService,
  ) {}

  @SubscribeMessage(SocketEvent.JOIN_AS_SEEKER)
  async handleJoinSeeker(@ConnectedSocket() client: Socket) {
    console.log('seeker connected:', client.id);
    await this.match.addSeeker(client.id);
    client.emit(SocketEvent.WAITING_ORACLE);
  }

  @SubscribeMessage(SocketEvent.JOIN_AS_ORACLE)
  async handleJoinOracle(@ConnectedSocket() oracle: Socket) {
    console.log('oracle connected:', oracle.id);
    const seekerId = await this.match.popSeeker();
    console.log('seeker found:', seekerId);
    if (!seekerId) {
      oracle.emit(SocketEvent.WAITING_SEEKER);
      return;
    }
    const roomId = `room:${seekerId}:${oracle.id}`;
    await this.session.create({
      roomId,
      seekerId,
      oracleId: oracle.id,
    });
    await oracle.join(roomId);
    const seekerSocket = this.server.sockets.sockets.get(seekerId);
    await seekerSocket?.join(roomId);
    this.server.to(roomId).emit(SocketEvent.MATCH_FOUND, { roomId });
  }

  @SubscribeMessage(SocketEvent.QUESTION_SEND)
  async handleQuestion(
    @MessageBody() data: { content: string; roomId: string },
  ) {
    const session = await this.session.findByRoom(data.roomId);
    if (!this.session.isActive(session)) return;
    const approved = await this.moderation.evaluate(data.content);
    if (!approved) {
      await this.session.close(session.roomId);
      this.server.to(session.roomId).emit(SocketEvent.SESSION_CLOSED);
      this.server.to(session.roomId).disconnectSockets();
      return;
    }
    // oracleId will always be defined here since session is active
    this.server.to(session.oracleId!).emit(SocketEvent.QUESTION_RECEIVED);
  }

  @SubscribeMessage(SocketEvent.ANSWER_SEND)
  async handleAnswer(@MessageBody() data: { content: string; roomId: string }) {
    const session = await this.session.findByRoom(data.roomId);
    if (!this.session.isActive(session)) return;
    const approved = await this.moderation.evaluate(data.content);
    if (!approved) return;
    this.server
      .to(session.roomId)
      .emit(SocketEvent.ANSWER_RECEIVED, { content: data.content });
    await this.session.close(session.roomId);
    this.server.to(session.roomId).emit(SocketEvent.SESSION_CLOSED);
    this.server.to(session.roomId).disconnectSockets();
  }

  async handleDisconnect(client: Socket) {
    await this.match.removeSeeker(client.id);
  }
}
