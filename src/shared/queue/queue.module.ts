import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          tls: config.get('NODE_ENV') === 'production' ? {} : undefined,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'matchmaking',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
