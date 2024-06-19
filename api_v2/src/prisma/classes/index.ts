import { EfMigrationsHistory as _EfMigrationsHistory } from './ef_migrations_history';
import { ChangeScheduleRequests as _ChangeScheduleRequests } from './change_schedule_requests';
import { ChangeShiftRequests as _ChangeShiftRequests } from './change_shift_requests';
import { EmployeeSchedules as _EmployeeSchedules } from './employee_schedules';
import { EslChangeShiftRequests as _EslChangeShiftRequests } from './esl_change_shift_requests';
import { EslOffsets as _EslOffsets } from './esl_offsets';
import { Forms as _Forms } from './forms';
import { Leaves as _Leaves } from './leaves';
import { LeaveTypes as _LeaveTypes } from './leave_types';
import { Medias as _Medias } from './medias';
import { MultiProjects as _MultiProjects } from './multi_projects';
import { Notifications as _Notifications } from './notifications';
import { Overtimes as _Overtimes } from './overtimes';
import { PersonalAccessTokens as _PersonalAccessTokens } from './personal_access_tokens';
import { Positions as _Positions } from './positions';
import { Projects as _Projects } from './projects';
import { Roles as _Roles } from './roles';
import { TimeEntries as _TimeEntries } from './time_entries';
import { Times as _Times } from './times';
import { Users as _Users } from './users';
import { WorkingDayTimes as _WorkingDayTimes } from './working_day_times';
import { WorkInterruptions as _WorkInterruptions } from './work_interruptions';
import { WorkInterruptionTypes as _WorkInterruptionTypes } from './work_interruption_types';

export namespace PrismaModel {
  export class EfMigrationsHistory extends _EfMigrationsHistory {}
  export class ChangeScheduleRequests extends _ChangeScheduleRequests {}
  export class ChangeShiftRequests extends _ChangeShiftRequests {}
  export class EmployeeSchedules extends _EmployeeSchedules {}
  export class EslChangeShiftRequests extends _EslChangeShiftRequests {}
  export class EslOffsets extends _EslOffsets {}
  export class Forms extends _Forms {}
  export class Leaves extends _Leaves {}
  export class LeaveTypes extends _LeaveTypes {}
  export class Medias extends _Medias {}
  export class MultiProjects extends _MultiProjects {}
  export class Notifications extends _Notifications {}
  export class Overtimes extends _Overtimes {}
  export class PersonalAccessTokens extends _PersonalAccessTokens {}
  export class Positions extends _Positions {}
  export class Projects extends _Projects {}
  export class Roles extends _Roles {}
  export class TimeEntries extends _TimeEntries {}
  export class Times extends _Times {}
  export class Users extends _Users {}
  export class WorkingDayTimes extends _WorkingDayTimes {}
  export class WorkInterruptions extends _WorkInterruptions {}
  export class WorkInterruptionTypes extends _WorkInterruptionTypes {}

  export const extraModels = [
    EfMigrationsHistory,
    ChangeScheduleRequests,
    ChangeShiftRequests,
    EmployeeSchedules,
    EslChangeShiftRequests,
    EslOffsets,
    Forms,
    Leaves,
    LeaveTypes,
    Medias,
    MultiProjects,
    Notifications,
    Overtimes,
    PersonalAccessTokens,
    Positions,
    Projects,
    Roles,
    TimeEntries,
    Times,
    Users,
    WorkingDayTimes,
    WorkInterruptions,
    WorkInterruptionTypes,
  ];
}
