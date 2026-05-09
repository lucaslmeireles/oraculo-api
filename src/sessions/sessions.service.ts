import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { SessionStatus } from 'generated/prisma/enums';
import { CreateSessionDto } from './sessions.type';

@Injectable()
export class SessionsService {
  constructor(private sessionRepository: SessionsRepository) {}

  async create(data: CreateSessionDto) {
    return this.sessionRepository.create(data);
  }

  async findByRoom(roomId: string) {
    const session = await this.sessionRepository.findByRoom(roomId);
    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  async setOracle(roomId: string, oracleId: string) {
    const session = await this.sessionRepository.findByRoom(roomId);

    if (!session) throw new NotFoundException('Sessão não encontrada');

    if (session.status !== SessionStatus.WAITING) {
      throw new BadRequestException('Sessão não está aguardando um oráculo');
    }

    return this.sessionRepository.setOracle(roomId, {
      oracleId,
      matchedAt: new Date(),
    });
  }

  async close(roomId: string) {
    const session = await this.sessionRepository.findByRoom(roomId);

    if (!session) throw new NotFoundException('Sessão não encontrada');

    if (session.status === SessionStatus.CLOSED) {
      throw new BadRequestException('Sessão já encerrada');
    }

    return this.sessionRepository.close(roomId);
  }

  isActive(session: Awaited<ReturnType<SessionsRepository['findByRoom']>>) {
    return session?.status === SessionStatus.ACTIVE;
  }
}
