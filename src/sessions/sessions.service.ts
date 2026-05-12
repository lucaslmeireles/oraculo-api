import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { CreateSessionDto } from './sessions.type';
import { SessionStatus } from '../../generated/prisma/enums';

@Injectable()
export class SessionsService {
  constructor(private sessionRepository: SessionsRepository) {}

  async create(data: CreateSessionDto) {
    return this.sessionRepository.create(data);
  }

  async findByRoom(roomId: string) {
    const session = await this.sessionRepository.findByRoom(roomId);
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async setOracle(roomId: string, oracleId: string) {
    const session = await this.sessionRepository.findByRoom(roomId);

    if (!session) throw new NotFoundException('Session not found');

    if (session.status !== SessionStatus.WAITING) {
      throw new BadRequestException('Session is not waiting for oracle');
    }

    return this.sessionRepository.setOracle(roomId, {
      oracleId,
      matchedAt: new Date(),
    });
  }

  async close(roomId: string) {
    const session = await this.sessionRepository.findByRoom(roomId);

    if (!session) throw new NotFoundException('Session not found');

    if (session.status === SessionStatus.CLOSED) {
      throw new BadRequestException('Session is closed');
    }

    return this.sessionRepository.close(roomId);
  }

  isActive(session: Awaited<ReturnType<SessionsRepository['findByRoom']>>) {
    return session?.status === SessionStatus.ACTIVE;
  }
}
