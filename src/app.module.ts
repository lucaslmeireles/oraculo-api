import { Module } from '@nestjs/common';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { SessionsModule } from './sessions/sessions.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { QueueModule } from './shared/queue/queue.module';
import { WebSocketModule } from './websocket/websocket.module';
import { ModerationModule } from './moderation/moderation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponibiliza o ConfigService globalmente
    }),
    MatchmakingModule,
    SessionsModule,
    PrismaModule,
    QueueModule,
    WebSocketModule,
    ModerationModule,
  ],
})
export class AppModule {}
