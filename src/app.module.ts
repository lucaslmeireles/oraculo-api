import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { SessionsModule } from './sessions/sessions.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { QueueModule } from './shared/queue/queue.module';
import { WebSocketModule } from './websocket/websocket.module';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [
    MatchmakingModule,
    SessionsModule,
    PrismaModule,
    QueueModule,
    WebSocketModule,
    ModerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
