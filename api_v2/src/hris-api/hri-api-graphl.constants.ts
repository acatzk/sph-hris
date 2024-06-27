export const getLatestPreviousTimeEntry = (userId: number) => `
  query {
    latestPreviousTimeEntry(id: ${userId}) {
      timeInId
      timeOutId
    }
  }
`;

export const getTimeEntriesQuery = (dateToday: string) => `
  query {
    timeEntries(date: "${dateToday}") {
      id
      date
      user {
        id
        email
      }
      timeIn {
        id
        timeHour
      }
      startTime
      endTime
    }
  }
`;

export const getUserByEmailQuery = (email: string) => `
  query {
    userByEmail(email: "${email}") {
      id
      name
      timeEntry {
        id
        timeIn {
          timeHour
        }
        date
      }
      employeeSchedule {
        id
        name
        workingDayTimes {
          id
          day
          from
          to
        }
      }
    }
  }
`;

export const timeInMutation = () => `
  mutation ($timeIn: TimeInRequestInput!) {
    updateTimeIn(timeIn: $timeIn)
  }
`;
