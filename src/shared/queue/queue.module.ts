import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get('NODE_ENV');
        if (nodeEnv === 'production') {
          return {
            connection: {
              url: config.get('REDIS_URL'),
            },
          };
        } else {
          return {
            connection: {
              host: config.get('REDIS_HOST', 'localhost'),
              port: config.get<number>('REDIS_PORT', 6379),
              tls: nodeEnv === 'production' ? {} : undefined,
            },
          };
        }
      },
    }),
    BullModule.registerQueue({
      name: 'matchmaking',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
