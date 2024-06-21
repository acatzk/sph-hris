import { ChangeShiftRequest } from './change_shift_request';
import { EslChangeShiftRequest } from './esl_change_shift_request';
import { EslOffset } from './esl_offset';
import { Overtime } from './overtime';
import { Time } from './time';
import { User } from './user';
import { WorkInterruption } from './work_interruption';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimeEntry {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiPropertyOptional({ type: Number })
  timeInId?: number;

  @ApiPropertyOptional({ type: Number })
  timeOutId?: number;

  @ApiProperty({ type: Date })
  startTime: Date;

  @ApiProperty({ type: Date })
  endTime: Date;

  @ApiProperty({ type: Date })
  date: Date;

  @ApiPropertyOptional({ type: String })
  workedHours?: string;

  @ApiProperty({ type: Date })
  trackedHours: Date;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: Date })
  breakEndTime: Date;

  @ApiProperty({ type: Date })
  breakStartTime: Date;

  @ApiPropertyOptional({ type: () => ChangeShiftRequest })
  changeShiftRequest?: ChangeShiftRequest;

  @ApiProperty({ isArray: true, type: () => EslChangeShiftRequest })
  eslChangeShiftRequests: EslChangeShiftRequest[];

  @ApiProperty({ isArray: true, type: () => EslOffset })
  eslOffsets: EslOffset[];

  @ApiPropertyOptional({ type: () => Overtime })
  overtime?: Overtime;

  @ApiPropertyOptional({ type: () => Time })
  timeIn?: Time;

  @ApiPropertyOptional({ type: () => Time })
  timeOut?: Time;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => WorkInterruption })
  workInterruptions: WorkInterruption[];
}
