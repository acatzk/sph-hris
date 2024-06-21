import { User } from './user';
import { WorkingDayTime } from './working_day_time';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeSchedule {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => User })
  users: User[];

  @ApiProperty({ isArray: true, type: () => WorkingDayTime })
  workingDayTimes: WorkingDayTime[];
}
