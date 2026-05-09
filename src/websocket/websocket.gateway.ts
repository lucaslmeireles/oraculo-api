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
    await this.match.addSeeker(client.id);
    client.emit(SocketEvent.WAITING_ORACLE);
  }

  @SubscribeMessage(SocketEvent.JOIN_AS_ORACLE)
  async handleJoinOracle(@ConnectedSocket() oracle: Socket) {
    const seekerId = await this.match.popSeeker();
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
    await this.server.sockets.sockets.get(seekerId)?.join(roomId);
    this.server.to(roomId).emit(SocketEvent.MATCH_FOUND);
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
    }
    // oracleId sempre vai ter algum valor nesse ponto do código, a session só vai ser criada com ele
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
      .emit(SocketEvent.QUESTION_RECEIVED, { content: data.content });
    await this.session.close(session.roomId);
    this.server.to(session.roomId).emit(SocketEvent.SESSION_CLOSED);
    this.server.to(session.roomId).disconnectSockets();
  }

  async handleDisconnect(client: Socket) {
    await this.match.removeSeeker(client.id);
  }
}
