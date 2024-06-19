import { Users } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Positions {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => Users })
  users: Users[];
}
