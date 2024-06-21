import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => User })
  users: User[];
}
