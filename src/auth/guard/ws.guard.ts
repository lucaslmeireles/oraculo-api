import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

interface JwtPayload {
  nickname: string;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;
    if (!token) {
      return false;
    }
    try {
      const payload = this.jwt.verify<JwtPayload>(token);
      client.data.nickname = payload.nickname;
      return true;
    } catch (e) {
      return false;
    }
    return false;
  }
}
