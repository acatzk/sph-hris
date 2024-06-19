import { Leaves } from './leaves';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LeaveTypes {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => Leaves })
  leaves: Leaves[];
}
