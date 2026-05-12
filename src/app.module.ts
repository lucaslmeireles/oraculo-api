import { Module } from '@nestjs/common';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { SessionsModule } from './sessions/sessions.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { QueueModule } from './shared/queue/queue.module';
import { WebSocketModule } from './websocket/websocket.module';
import { ModerationModule } from './moderation/moderation.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MatchmakingModule,
    SessionsModule,
    PrismaModule,
    QueueModule,
    WebSocketModule,
    ModerationModule,
  ],
})
export class AppModule {}
