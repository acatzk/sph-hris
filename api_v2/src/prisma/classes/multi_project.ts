import { ChangeShiftRequest } from './change_shift_request';
import { Leave } from './leave';
import { Overtime } from './overtime';
import { Project } from './project';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MultiProject {
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

  @ApiPropertyOptional({ type: () => ChangeShiftRequest })
  changeShiftRequest?: ChangeShiftRequest;

  @ApiPropertyOptional({ type: () => Leave })
  leave?: Leave;

  @ApiPropertyOptional({ type: () => Overtime })
  overtime?: Overtime;

  @ApiPropertyOptional({ type: () => Project })
  project?: Project;

  @ApiPropertyOptional({ type: () => User })
  user?: User;
}
