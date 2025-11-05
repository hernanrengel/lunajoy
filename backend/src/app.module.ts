import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { EventsModule } from './events/events.module';
import { Jwt } from './common/strategies/jwt';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    PrismaModule,
    AuthModule,
    LogsModule,
    EventsModule,
  ],
  providers: [Jwt, JwtStrategy],
})
export class AppModule {}
