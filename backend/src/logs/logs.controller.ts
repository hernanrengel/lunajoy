import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Query,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CreateLogDto } from './dto/create-log.dto';
import { EventsGateway } from '../events/events/events.gateway';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(
    private readonly logs: LogsService,
    private readonly events: EventsGateway,
  ) {}

  @Get()
  async all(@Req() req: any) {
    return this.logs.list(req.user.uid);
  }

  @Post()
  @HttpCode(201)
  async create(@Req() req: any, @Body() dto: CreateLogDto) {
    const log = await this.logs.create(req.user.uid, dto);
    this.events.emitNewLog(req.user.uid, log);
    return log;
  }

  @Get('today')
  async hasLogForToday(@Req() req: any, @Query('date') dateString?: string) {
    const date = dateString ? new Date(dateString) : new Date();
    const hasLog = await this.logs.hasLogForToday(req.user.uid, date);
    return { hasLog };
  }
}
