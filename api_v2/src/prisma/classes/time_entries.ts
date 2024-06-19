import { ChangeShiftRequests } from './change_shift_requests';
import { EslChangeShiftRequests } from './esl_change_shift_requests';
import { EslOffsets } from './esl_offsets';
import { Overtimes } from './overtimes';
import { Times } from './times';
import { Users } from './users';
import { WorkInterruptions } from './work_interruptions';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimeEntries {
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

  @ApiPropertyOptional({ type: () => ChangeShiftRequests })
  changeShiftRequest?: ChangeShiftRequests;

  @ApiProperty({ isArray: true, type: () => EslChangeShiftRequests })
  eslChangeShiftRequests: EslChangeShiftRequests[];

  @ApiProperty({ isArray: true, type: () => EslOffsets })
  eslOffsets: EslOffsets[];

  @ApiPropertyOptional({ type: () => Overtimes })
  overtime?: Overtimes;

  @ApiPropertyOptional({ type: () => Times })
  timeIn?: Times;

  @ApiPropertyOptional({ type: () => Times })
  timeOut?: Times;

  @ApiProperty({ type: () => Users })
  user: Users;

  @ApiProperty({ isArray: true, type: () => WorkInterruptions })
  workInterruptions: WorkInterruptions[];
}
