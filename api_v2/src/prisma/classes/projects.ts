import { Leaves } from './leaves';
import { MultiProjects } from './multi_projects';
import { Users } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Projects {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: Number })
  projectLeaderId?: number;

  @ApiPropertyOptional({ type: Number })
  projectSubLeaderId?: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => Leaves })
  leaves: Leaves[];

  @ApiProperty({ isArray: true, type: () => MultiProjects })
  multiProjects: MultiProjects[];

  @ApiPropertyOptional({ type: () => Users })
  projectLeader?: Users;

  @ApiPropertyOptional({ type: () => Users })
  projectSubLeader?: Users;
}
