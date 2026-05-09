import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MatchmakingService {
  constructor(@InjectQueue('matchmaking') private queue: Queue) {}

  async addSeeker(socketId: string) {
    await this.queue.add(
      'seeker',
      { socketId },
      {
        jobId: socketId,
      },
    );
  }

  async popSeeker(): Promise<string | null> {
    const jobs = await this.queue.getWaiting(0, 0);
    if (!jobs.length) return null;
    const job = jobs[0];
    await job.remove();
    return job.data.socketId;
  }

  async removeSeeker(seekerId: string) {
    await this.queue.remove(seekerId);
  }

  async hasSeeker(): Promise<boolean> {
    const count = await this.queue.getWaitingCount();
    return count > 0;
  }
}
