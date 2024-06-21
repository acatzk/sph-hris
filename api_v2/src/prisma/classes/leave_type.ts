import { Leave } from './leave';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LeaveType {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => Leave })
  leaves: Leave[];
}
