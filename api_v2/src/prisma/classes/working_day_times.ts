import { EmployeeSchedules } from './employee_schedules';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkingDayTimes {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  employeeScheduleId: number;

  @ApiProperty({ type: Date })
  from: Date;

  @ApiProperty({ type: Date })
  to: Date;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiPropertyOptional({ type: String })
  day?: string;

  @ApiProperty({ type: Date })
  breakFrom: Date;

  @ApiProperty({ type: Date })
  breakTo: Date;

  @ApiProperty({ type: () => EmployeeSchedules })
  employeeSchedule: EmployeeSchedules;
}
