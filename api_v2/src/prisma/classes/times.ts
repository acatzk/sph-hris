import { Medias } from './medias';
import { TimeEntries } from './time_entries';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Times {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  timeHour: Date;

  @ApiPropertyOptional({ type: String })
  remarks?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => Medias })
  medias: Medias[];

  @ApiProperty({ isArray: true, type: () => TimeEntries })
  timeEntriesAsTimeIn: TimeEntries[];

  @ApiProperty({ isArray: true, type: () => TimeEntries })
  timeEntriesAsTimeOut: TimeEntries[];
}
