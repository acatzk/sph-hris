import { TimeEntries } from './time_entries';
import { WorkInterruptionTypes } from './work_interruption_types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkInterruptions {
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

  @ApiProperty({ type: () => TimeEntries })
  timeEntry: TimeEntries;

  @ApiPropertyOptional({ type: () => WorkInterruptionTypes })
  workInterruptionType?: WorkInterruptionTypes;
}
