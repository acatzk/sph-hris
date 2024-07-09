export enum ErrorMessageEnum {
  FAILED_OVERTIME_REQUEST = 'Overtime Request Failed.',
  FAILED_LEAVE_REQUEST = 'Leave/Undertime Request Failed.',
  FAILED_SCHEDULE_CREATION = 'Failed to create schedule!',
  FAILED_SCHEDULE_UPDATE = 'Failed to update schedule!',
  FAILED_ADDING_USER_TO_SCHEDULE = 'Failed to add user to schedule!',
  FAILED_ADDING_NEW_EMPLOYEE = 'Failed to add new employee!',
  FAILED_SCHEDULE_DELETE = 'Failed to delete schedule!',
  FAILED_SCHEDULE_DELETE_USER = 'Schedule has currently assigned Employees. Failed to delete schedule!',
  INVALID_ACCESS_TOKEN = 'Invalid Access Token',
  MAXIMUM_LIMIT_OF_PAID_LEAVES = ' has 0 remaining paid leaves!',
  EXCEEDS_MAXIMUM_REMAINING_PAID_LEAVES = ' does not have enough remaining paid leaves!',
  LEAVE_USERDETAILS_NULL_IDENTIFIER = 'Leave or userDetails is null',
  FAILED_LEAVE_CANCEL = 'Failed to cancel leave!',
  EMPTY_OVERTIME = 'Empty overtime request range',
  EXISTING_OVERTIME = 'There is an existing overtime',
  ADVANCED_DATE = 'It is not possible to file a request in advance',
}