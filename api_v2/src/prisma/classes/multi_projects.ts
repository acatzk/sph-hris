import { ChangeShiftRequests } from './change_shift_requests';
import { Leaves } from './leaves';
import { Overtimes } from './overtimes';
import { Projects } from './projects';
import { Users } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MultiProjects {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  type: string;

  @ApiPropertyOptional({ type: Number })
  projectId?: number;

  @ApiPropertyOptional({ type: Number })
  projectLeaderId?: number;

  @ApiPropertyOptional({ type: Number })
  leaveId?: number;

  @ApiPropertyOptional({ type: Number })
  overtimeId?: number;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiPropertyOptional({ type: Number })
  changeShiftRequestId?: number;

  @ApiPropertyOptional({ type: () => ChangeShiftRequests })
  changeShiftRequest?: ChangeShiftRequests;

  @ApiPropertyOptional({ type: () => Leaves })
  leave?: Leaves;

  @ApiPropertyOptional({ type: () => Overtimes })
  overtime?: Overtimes;

  @ApiPropertyOptional({ type: () => Projects })
  project?: Projects;

  @ApiPropertyOptional({ type: () => Users })
  user?: Users;
}
