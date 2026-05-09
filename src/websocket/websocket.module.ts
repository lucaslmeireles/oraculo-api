import { Module } from '@nestjs/common';
import { SessionGateway } from './websocket.gateway';

@Module({
  providers: [SessionGateway],
})
export class WebSocketModule {}
