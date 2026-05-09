import { Injectable } from '@nestjs/common';
import { SessionCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateOracleDto } from './sessions.type';
import { SessionStatus } from 'generated/prisma/enums';

@Injectable()
export class SessionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: SessionCreateInput) {
    return await this.prisma.session.create({
      data: {
        roomId: data.roomId,
        seekerId: data.seekerId,
        status: SessionStatus.WAITING,
      },
    });
  }

  async findByRoom(roomId: string) {
    return await this.prisma.session.findUnique({
      where: {
        roomId,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.session.findFirst({
      where: {
        id,
      },
    });
  }

  async setOracle(roomId: string, data: UpdateOracleDto) {
    return await this.prisma.session.update({
      where: {
        roomId,
      },
      data: {
        oracleId: data.oracleId,
        matchedAt: data.matchedAt,
        status: SessionStatus.ACTIVE,
      },
    });
  }

  async close(roomId: string) {
    return await this.prisma.session.update({
      where: {
        roomId,
      },
      data: {
        closedAt: new Date(),
        status: SessionStatus.CLOSED,
      },
    });
  }
}
