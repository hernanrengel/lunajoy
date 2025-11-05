import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../events/events/events.gateway';
import { startOfDay, endOfDay } from 'date-fns';

const mockPrisma = {
  log: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

const mockEventsGateway = {
  emitNewLog: jest.fn(),
};

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return logs for a user', async () => {
      const mockLogs = [{ id: '1', userId: 'user1', mood: 5 }];
      mockPrisma.log.findMany.mockResolvedValue(mockLogs);

      const result = await service.list('user1');

      expect(mockPrisma.log.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { date: 'desc' },
        take: 365,
      });
      expect(result).toEqual(mockLogs);
    });
  });

  describe('hasLogForToday', () => {
    it('should return true if log exists for today', async () => {
      const today = new Date();
      mockPrisma.log.findFirst.mockResolvedValue({ id: '1' });

      const result = await service.hasLogForToday('user1', today);

      expect(mockPrisma.log.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          date: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if no log exists for today', async () => {
      mockPrisma.log.findFirst.mockResolvedValue(null);
      const result = await service.hasLogForToday('user1');
      expect(result).toBe(false);
    });
  });

  describe('create', () => {
    const mockLogData = {
      mood: 5,
      sleepHours: 8,
      sleepQuality: 4,
      stress: 3,
      symptoms: 'Headache',
    };

    it('should create a new log', async () => {
      const newLog = { id: '1', userId: 'user1', ...mockLogData };
      mockPrisma.log.create.mockResolvedValue(newLog);

      const result = await service.create('user1', mockLogData);

      expect(mockPrisma.log.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          date: expect.any(Date),
          mood: 5,
          sleepHours: 8,
          sleepQuality: 4,
          stress: 3,
          symptoms: 'Headache',
          anxiety: undefined,
          activityType: undefined,
          activityMins: undefined,
          socialCount: undefined,
        },
        include: {
          user: true,
        },
      });
      expect(mockEventsGateway.emitNewLog).toHaveBeenCalledWith('user1', newLog);
      expect(result).toEqual(newLog);
    });
  });
});
