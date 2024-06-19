import { ChangeScheduleRequests } from './change_schedule_requests';
import { ChangeShiftRequests } from './change_shift_requests';
import { EslChangeShiftRequests } from './esl_change_shift_requests';
import { EslOffsets } from './esl_offsets';
import { Forms } from './forms';
import { Leaves } from './leaves';
import { MultiProjects } from './multi_projects';
import { Notifications } from './notifications';
import { Overtimes } from './overtimes';
import { PersonalAccessTokens } from './personal_access_tokens';
import { Projects } from './projects';
import { TimeEntries } from './time_entries';
import { EmployeeSchedules } from './employee_schedules';
import { Medias } from './medias';
import { Positions } from './positions';
import { Roles } from './roles';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Users {
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

  @ApiProperty({ isArray: true, type: () => ChangeScheduleRequests })
  changeScheduleRequests: ChangeScheduleRequests[];

  @ApiProperty({ isArray: true, type: () => ChangeShiftRequests })
  changeShiftsAsManager: ChangeShiftRequests[];

  @ApiProperty({ isArray: true, type: () => ChangeShiftRequests })
  changeShiftsAsUser: ChangeShiftRequests[];

  @ApiProperty({ isArray: true, type: () => EslChangeShiftRequests })
  eslChangeShiftsAsTeamLeader: EslChangeShiftRequests[];

  @ApiProperty({ isArray: true, type: () => EslChangeShiftRequests })
  eslChangeShiftsAsUser: EslChangeShiftRequests[];

  @ApiProperty({ isArray: true, type: () => EslOffsets })
  eslOffsetsAsTeamLeader: EslOffsets[];

  @ApiProperty({ isArray: true, type: () => EslOffsets })
  eslOffsetsAsUser: EslOffsets[];

  @ApiProperty({ isArray: true, type: () => Forms })
  forms: Forms[];

  @ApiProperty({ isArray: true, type: () => Leaves })
  leavesAsManager: Leaves[];

  @ApiProperty({ isArray: true, type: () => Leaves })
  leavesAsUser: Leaves[];

  @ApiProperty({ isArray: true, type: () => MultiProjects })
  multiProjects: MultiProjects[];

  @ApiProperty({ isArray: true, type: () => Notifications })
  notifications: Notifications[];

  @ApiProperty({ isArray: true, type: () => Overtimes })
  overtimesAsManager: Overtimes[];

  @ApiProperty({ isArray: true, type: () => Overtimes })
  overtimesAsUser: Overtimes[];

  @ApiProperty({ isArray: true, type: () => PersonalAccessTokens })
  personalAccessTokens: PersonalAccessTokens[];

  @ApiProperty({ isArray: true, type: () => Projects })
  projectsAsLeader: Projects[];

  @ApiProperty({ isArray: true, type: () => Projects })
  projectsAsSubLeader: Projects[];

  @ApiProperty({ isArray: true, type: () => TimeEntries })
  timeEntries: TimeEntries[];

  @ApiProperty({ type: () => EmployeeSchedules })
  employeeSchedule: EmployeeSchedules;

  @ApiPropertyOptional({ type: () => Medias })
  media?: Medias;

  @ApiProperty({ type: () => Positions })
  position: Positions;

  @ApiProperty({ type: () => Roles })
  role: Roles;
}
