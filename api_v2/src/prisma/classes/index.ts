import { EfMigrationsHistory as _EfMigrationsHistory } from './ef_migrations_history';
import { ChangeScheduleRequest as _ChangeScheduleRequest } from './change_schedule_request';
import { ChangeShiftRequest as _ChangeShiftRequest } from './change_shift_request';
import { EmployeeSchedule as _EmployeeSchedule } from './employee_schedule';
import { EslChangeShiftRequest as _EslChangeShiftRequest } from './esl_change_shift_request';
import { EslOffset as _EslOffset } from './esl_offset';
import { Form as _Form } from './form';
import { Leave as _Leave } from './leave';
import { LeaveType as _LeaveType } from './leave_type';
import { Media as _Media } from './media';
import { MultiProject as _MultiProject } from './multi_project';
import { Notification as _Notification } from './notification';
import { Overtime as _Overtime } from './overtime';
import { PersonalAccessToken as _PersonalAccessToken } from './personal_access_token';
import { Position as _Position } from './position';
import { Project as _Project } from './project';
import { Role as _Role } from './role';
import { TimeEntry as _TimeEntry } from './time_entry';
import { Time as _Time } from './time';
import { User as _User } from './user';
import { WorkingDayTime as _WorkingDayTime } from './working_day_time';
import { WorkInterruption as _WorkInterruption } from './work_interruption';
import { WorkInterruptionType as _WorkInterruptionType } from './work_interruption_type';

export namespace PrismaModel {
  export class EfMigrationsHistory extends _EfMigrationsHistory {}
  export class ChangeScheduleRequest extends _ChangeScheduleRequest {}
  export class ChangeShiftRequest extends _ChangeShiftRequest {}
  export class EmployeeSchedule extends _EmployeeSchedule {}
  export class EslChangeShiftRequest extends _EslChangeShiftRequest {}
  export class EslOffset extends _EslOffset {}
  export class Form extends _Form {}
  export class Leave extends _Leave {}
  export class LeaveType extends _LeaveType {}
  export class Media extends _Media {}
  export class MultiProject extends _MultiProject {}
  export class Notification extends _Notification {}
  export class Overtime extends _Overtime {}
  export class PersonalAccessToken extends _PersonalAccessToken {}
  export class Position extends _Position {}
  export class Project extends _Project {}
  export class Role extends _Role {}
  export class TimeEntry extends _TimeEntry {}
  export class Time extends _Time {}
  export class User extends _User {}
  export class WorkingDayTime extends _WorkingDayTime {}
  export class WorkInterruption extends _WorkInterruption {}
  export class WorkInterruptionType extends _WorkInterruptionType {}

  export const extraModels = [
    EfMigrationsHistory,
    ChangeScheduleRequest,
    ChangeShiftRequest,
    EmployeeSchedule,
    EslChangeShiftRequest,
    EslOffset,
    Form,
    Leave,
    LeaveType,
    Media,
    MultiProject,
    Notification,
    Overtime,
    PersonalAccessToken,
    Position,
    Project,
    Role,
    TimeEntry,
    Time,
    User,
    WorkingDayTime,
    WorkInterruption,
    WorkInterruptionType,
  ];
}
