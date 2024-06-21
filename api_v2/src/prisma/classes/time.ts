import { Media } from './media';
import { TimeEntry } from './time_entry';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Time {
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

  @ApiProperty({ isArray: true, type: () => Media })
  medias: Media[];

  @ApiProperty({ isArray: true, type: () => TimeEntry })
  timeEntriesAsTimeIn: TimeEntry[];

  @ApiProperty({ isArray: true, type: () => TimeEntry })
  timeEntriesAsTimeOut: TimeEntry[];
}
