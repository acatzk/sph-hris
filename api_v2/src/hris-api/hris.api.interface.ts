export interface TimeEntry {
  id: number;
  date: string;
  user: {
    id: number;
    email: string;
  };
  timeIn: {
    id: number;
    timeHour: string;
  };
  startTime: string;
  endTime: string;
}

export interface WorkingDayTime {
  id: number;
  day: string;
  from: string;
  to: string;
}

export interface User {
  id: number;
  name: string;
  timeEntry: {
    id: number;
    timeIn: {
      id: number;
      timeHour: string;
    };
    date: string;
  };
  employeeSchedule: {
    id: number;
    name: string;
    workingDayTimes: WorkingDayTime[];
  };
}

export interface TimeInRequest {
  timeIn: {
    id: number;
    userId: number;
    startTime: string;
    endTime: string;
    date: string;
    timeHour: string;
    remarks: string;
  };
}
