import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { EventsGateway } from '../events/events/events.gateway';

@Injectable()
class MockEventsGateway {
  emitNewLog = jest.fn();
}

const mockLogsService = {
  list: jest.fn(),
  create: jest.fn(),
  hasLogForToday: jest.fn(),
};

const mockEventsGateway = {
  emitNewLog: jest.fn(),
};

const mockRequest = {
  user: {
    uid: 'user1',
    email: 'test@example.com',
  },
};

describe('LogsController', () => {
  let controller: LogsController;
  let eventsGateway: MockEventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
        {
          provide: EventsGateway,
          useClass: MockEventsGateway,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockRequest.user;
          return true;
        },
      })
      .compile();

    controller = module.get<LogsController>(LogsController);
    eventsGateway = module.get<MockEventsGateway>(EventsGateway);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /logs', () => {
    it('should return user logs', async () => {
      const mockLogs = [
        { id: '1', userId: 'user1', mood: 5 },
        { id: '2', userId: 'user1', mood: 7 },
      ];
      mockLogsService.list.mockResolvedValue(mockLogs);

      const result = await controller.all(mockRequest as any);

      expect(mockLogsService.list).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('POST /logs', () => {
    const mockLogData = {
      mood: 5,
      sleepHours: 8,
      sleepQuality: 4,
      stress: 3,
      symptoms: 'Headache',
    };

    it('should create a new log', async () => {
      const newLog = { id: '1', userId: 'user1', ...mockLogData };
      mockLogsService.create.mockResolvedValue(newLog);

      const result = await controller.create(mockRequest as any, mockLogData);

      expect(mockLogsService.create).toHaveBeenCalledWith('user1', mockLogData);
      expect(eventsGateway.emitNewLog).toHaveBeenCalledWith('user1', newLog);
      expect(result).toEqual(newLog);
    });
  });

  describe('GET /logs/today', () => {
    it('should check if user has a log for today', async () => {
      const today = new Date().toISOString();
      mockLogsService.hasLogForToday.mockResolvedValue(true);

      const result = await controller.hasLogForToday(
        mockRequest as any,
        today,
      );

      expect(mockLogsService.hasLogForToday).toHaveBeenCalledWith(
        'user1',
        new Date(today),
      );
      expect(result).toEqual({ hasLog: true });
    });

    it('should use current date if no date provided', async () => {
      const now = new Date();
      mockLogsService.hasLogForToday.mockResolvedValue(false);

      const result = await controller.hasLogForToday(mockRequest as any);

      expect(mockLogsService.hasLogForToday).toHaveBeenCalledWith(
        'user1',
        expect.any(Date),
      );
      expect(result).toEqual({ hasLog: false });
    });
  });
});
