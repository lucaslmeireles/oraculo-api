import { Global, Module } from '@nestjs/common';
import { SessionGateway } from './websocket.gateway';
import { SessionsModule } from 'src/sessions/sessions.module';
import { MatchmakingModule } from 'src/matchmaking/matchmaking.module';
import { ModerationModule } from 'src/moderation/moderation.module';

@Global()
@Module({
  imports: [SessionsModule, MatchmakingModule, ModerationModule],
  providers: [SessionGateway],
  exports: [SessionGateway],
})
export class WebSocketModule {}
