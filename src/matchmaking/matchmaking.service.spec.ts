import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from './matchmaking.service';
import { getQueueToken } from '@nestjs/bullmq';

const mockQueue = {
  add: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  getWaiting: jest.fn().mockReturnThis(),
  getWaitingCount: jest.fn().mockReturnThis(),
};

describe('MatchmakingService', () => {
  let service: MatchmakingService;
  let queue: jest.Mocked<typeof mockQueue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        {
          provide: getQueueToken('matchmaking'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
    queue = module.get(getQueueToken('matchmaking'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(queue).toBeDefined();
  });

  it('should add a seeker to the queue', async () => {
    await service.addSeeker('socket1');
    expect(queue.add).toHaveBeenCalledWith(
      'seeker',
      { socketId: 'socket1' },
      { jobId: 'socket1' },
    );
  });

  it('should pop a seeker from the queue', async () => {
    queue.getWaiting.mockResolvedValueOnce([
      { data: { socketId: 'socket1' }, remove: jest.fn() },
    ] as any);
    const seekerId = await service.popSeeker();
    expect(seekerId).toBe('socket1');
    expect(queue.getWaiting).toHaveBeenCalled();
  });

  it('should return null if no seekers are in the queue', async () => {
    queue.getWaiting.mockResolvedValueOnce([] as any);
    const seekerId = await service.popSeeker();
    expect(seekerId).toBeNull();
    expect(queue.getWaiting).toHaveBeenCalled();
  });

  it('should remove a seeker from the queue', async () => {
    await service.removeSeeker('socket1');
    expect(queue.remove).toHaveBeenCalledWith('socket1');
  });

  it('should return true if there are seekers in the queue', async () => {
    queue.getWaitingCount.mockResolvedValueOnce(1);
    const hasSeeker = await service.hasSeeker();
    expect(hasSeeker).toBe(true);
    expect(queue.getWaitingCount).toHaveBeenCalled();
  });
});
