import { TimeEntryDTO, UserDTO } from '@/graphql/graphql';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TimeRecordService } from './time-record.service';

@Resolver('TimeEntry')
export class TimeRecordResolver {
    constructor(
        private readonly timeRecordService: TimeRecordService,
    ){}

   /**
   * Handles the GET_EMPLOYEE_TIMESHEET request.
   *
   * @param {number} id - The user ID.
   * @returns {Promise<TimeEntryDTO[]>} The list of time entries.
   */
    @Query(() => [TimeEntryDTO])
    async timeEntriesByEmployeeId(@Args('id') id: number): Promise<TimeEntryDTO[]>{
        return await this.timeRecordService.getTimeEntriesById(id);
    }

    /**
    * Handles the GET_USER_QUERY request.
    *
    * @param {number} id - The user ID input.
    * @returns {Promise<UserDTO>} User information.
    */
    //
    @Query(() => UserDTO)
    async userById(@Args('id') id: number): Promise<UserDTO>{
        return await this.timeRecordService.getUserById(id);
    }
}
