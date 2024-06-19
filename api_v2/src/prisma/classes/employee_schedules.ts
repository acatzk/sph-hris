import { Users } from './users';
import { WorkingDayTimes } from './working_day_times';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeSchedules {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => Users })
  users: Users[];

  @ApiProperty({ isArray: true, type: () => WorkingDayTimes })
  workingDayTimes: WorkingDayTimes[];
}
