import { TimeEntry } from './time_entry';
import { WorkInterruptionType } from './work_interruption_type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkInterruption {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  timeEntryId: number;

  @ApiPropertyOptional({ type: Number })
  workInterruptionTypeId?: number;

  @ApiPropertyOptional({ type: String })
  otherReason?: string;

  @ApiPropertyOptional({ type: Date })
  timeOut?: Date;

  @ApiPropertyOptional({ type: Date })
  timeIn?: Date;

  @ApiPropertyOptional({ type: String })
  remarks?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: () => TimeEntry })
  timeEntry: TimeEntry;

  @ApiPropertyOptional({ type: () => WorkInterruptionType })
  workInterruptionType?: WorkInterruptionType;
}
