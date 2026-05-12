import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { SessionStatus } from '../../generated/prisma/enums';

const mockRepository = {
  create: jest.fn().mockReturnThis(),
  findByRoom: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  setOracle: jest.fn().mockReturnThis(),
  close: jest.fn().mockReturnThis(),
};

describe('SessionsService', () => {
  let service: SessionsService;
  let repository: jest.Mocked<SessionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: SessionsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(SessionsService);
    repository = module.get(SessionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should throw an error for closing the session if session is closed', async () => {
    repository.findByRoom.mockResolvedValueOnce({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.CLOSED,
      closedAt: new Date(),
      matchedAt: new Date(),
      createdAt: new Date(),
    });
    await expect(service.close('test')).rejects.toThrow('Session is closed');
  });

  it('should close the session', async () => {
    repository.findByRoom.mockResolvedValueOnce({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.ACTIVE,
      closedAt: new Date(),
      matchedAt: new Date(),
      createdAt: new Date(),
    });
    repository.close.mockResolvedValueOnce({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.CLOSED,
      closedAt: new Date(),
      matchedAt: new Date(),
      createdAt: new Date(),
    });
    await expect(service.close('test')).resolves.toMatchObject({
      status: SessionStatus.CLOSED,
    });
  });

  it('should throw an error for setting oracle if session is not waiting', async () => {
    repository.findByRoom.mockResolvedValueOnce({
      id: '1',
      oracleId: null,
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.ACTIVE,
      closedAt: null,
      matchedAt: null,
      createdAt: new Date(),
    });
    await expect(service.setOracle('test', 'oracle1')).rejects.toThrow(
      'Session is not waiting for oracle',
    );
  });

  it('should set oracle and activate session', async () => {
    repository.findByRoom.mockResolvedValueOnce({
      id: '1',
      oracleId: null,
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.WAITING,
      closedAt: null,
      matchedAt: null,
      createdAt: new Date(),
    });
    repository.setOracle.mockResolvedValueOnce({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.ACTIVE,
      closedAt: null,
      matchedAt: new Date(),
      createdAt: new Date(),
    });
    await expect(service.setOracle('test', 'oracle1')).resolves.toMatchObject({
      status: SessionStatus.ACTIVE,
    });
  });

  it('should throw an error for finding session by room if session does not exist', async () => {
    repository.findByRoom.mockResolvedValueOnce(null);
    await expect(service.findByRoom('test')).rejects.toThrow(
      'Session not found',
    );
  });

  it('should find session by room', async () => {
    repository.findByRoom.mockResolvedValueOnce({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      createdAt: new Date(),
      matchedAt: new Date(),
      closedAt: null,
      status: SessionStatus.ACTIVE,
    });
    await expect(service.findByRoom('test')).resolves.toMatchObject({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      status: SessionStatus.ACTIVE,
    });
  });

  it('should create session', async () => {
    repository.create.mockResolvedValueOnce({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      createdAt: new Date(),
      matchedAt: null,
      closedAt: null,
      status: SessionStatus.WAITING,
    });
    await expect(
      service.create({
        roomId: 'test',
        seekerId: 'seeker1',
        oracleId: 'oracle1',
      }),
    ).resolves.toMatchObject({
      id: '1',
      oracleId: 'oracle1',
      seekerId: 'seeker1',
      roomId: 'test',
      createdAt: new Date(),
      matchedAt: null,
      closedAt: null,
      status: SessionStatus.WAITING,
    });
  });
});
