import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateLogDto {
  @IsOptional() @IsString() date?: string; // ISO (opcional)
  @IsOptional() @IsInt() @Min(1) @Max(10) mood?: number;
  @IsOptional() @IsInt() @Min(0) @Max(10) anxiety?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(24) sleepHours?: number;
  @IsOptional() @IsInt() @Min(0) @Max(10) sleepQuality?: number;
  @IsOptional() @IsString() activityType?: string;
  @IsOptional() @IsInt() @Min(0) @Max(1440) activityMins?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100) socialCount?: number;
  @IsOptional() @IsInt() @Min(0) @Max(10) stress?: number;
  @IsOptional() @IsString() symptoms?: string;
  @IsOptional() @IsString() notes?: string;
}
