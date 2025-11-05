import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EventsGateway } from '../events/events/events.gateway';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class LogsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => EventsGateway))
    private eventsGateway: EventsGateway
  ) {}

  async list(userId: string) {
    return this.prisma.log.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 365,
    });
  }

  async hasLogForToday(userId: string, date: Date = new Date()) {
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    const todayLog = await this.prisma.log.findFirst({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });
    return !!todayLog;
  }

  async create(userId: string, dto: CreateLogDto) {
    // Check if user already has a log for today
    // const hasLog = await this.hasLogForToday(userId);
    // if (hasLog) {
    //   throw new Error('User already has a log for today');
    // }

    const log = await this.prisma.log.create({
      data: {
        userId,
        date: dto.date ? new Date(dto.date) : new Date(),
        mood: dto.mood,
        anxiety: dto.anxiety,
        sleepHours: dto.sleepHours,
        sleepQuality: dto.sleepQuality,
        activityType: dto.activityType,
        activityMins: dto.activityMins,
        socialCount: dto.socialCount,
        stress: dto.stress,
        symptoms: dto.symptoms,
        notes: dto.notes,
      },
      include: {
        user: true,
      },
    });

    // Emit the new log event
    this.eventsGateway.emitNewLog(userId, log);
    
    return log;
  }
}
