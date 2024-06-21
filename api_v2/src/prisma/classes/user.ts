import { ChangeScheduleRequest } from './change_schedule_request';
import { ChangeShiftRequest } from './change_shift_request';
import { EslChangeShiftRequest } from './esl_change_shift_request';
import { EslOffset } from './esl_offset';
import { Form } from './form';
import { Leave } from './leave';
import { MultiProject } from './multi_project';
import { Notification } from './notification';
import { Overtime } from './overtime';
import { PersonalAccessToken } from './personal_access_token';
import { Project } from './project';
import { TimeEntry } from './time_entry';
import { EmployeeSchedule } from './employee_schedule';
import { Media } from './media';
import { Position } from './position';
import { Role } from './role';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: String })
  email?: string;

  @ApiProperty({ type: Number })
  roleId: number;

  @ApiProperty({ type: Number })
  employeeScheduleId: number;

  @ApiProperty({ type: Boolean })
  isOnline: boolean;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: Number })
  paidLeaves: number;

  @ApiPropertyOptional({ type: Number })
  profileImageId?: number;

  @ApiProperty({ type: Number })
  positionId: number;

  @ApiProperty({ isArray: true, type: () => ChangeScheduleRequest })
  changeScheduleRequests: ChangeScheduleRequest[];

  @ApiProperty({ isArray: true, type: () => ChangeShiftRequest })
  changeShiftsAsManager: ChangeShiftRequest[];

  @ApiProperty({ isArray: true, type: () => ChangeShiftRequest })
  changeShiftsAsUser: ChangeShiftRequest[];

  @ApiProperty({ isArray: true, type: () => EslChangeShiftRequest })
  eslChangeShiftsAsTeamLeader: EslChangeShiftRequest[];

  @ApiProperty({ isArray: true, type: () => EslChangeShiftRequest })
  eslChangeShiftsAsUser: EslChangeShiftRequest[];

  @ApiProperty({ isArray: true, type: () => EslOffset })
  eslOffsetsAsTeamLeader: EslOffset[];

  @ApiProperty({ isArray: true, type: () => EslOffset })
  eslOffsetsAsUser: EslOffset[];

  @ApiProperty({ isArray: true, type: () => Form })
  forms: Form[];

  @ApiProperty({ isArray: true, type: () => Leave })
  leavesAsManager: Leave[];

  @ApiProperty({ isArray: true, type: () => Leave })
  leavesAsUser: Leave[];

  @ApiProperty({ isArray: true, type: () => MultiProject })
  multiProjects: MultiProject[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];

  @ApiProperty({ isArray: true, type: () => Overtime })
  overtimesAsManager: Overtime[];

  @ApiProperty({ isArray: true, type: () => Overtime })
  overtimesAsUser: Overtime[];

  @ApiProperty({ isArray: true, type: () => PersonalAccessToken })
  personalAccessTokens: PersonalAccessToken[];

  @ApiProperty({ isArray: true, type: () => Project })
  projectsAsLeader: Project[];

  @ApiProperty({ isArray: true, type: () => Project })
  projectsAsSubLeader: Project[];

  @ApiProperty({ isArray: true, type: () => TimeEntry })
  timeEntries: TimeEntry[];

  @ApiProperty({ type: () => EmployeeSchedule })
  employeeSchedule: EmployeeSchedule;

  @ApiPropertyOptional({ type: () => Media })
  media?: Media;

  @ApiProperty({ type: () => Position })
  position: Position;

  @ApiProperty({ type: () => Role })
  role: Role;
}
