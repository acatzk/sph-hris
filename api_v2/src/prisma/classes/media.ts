import { Time } from './time';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Media {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  collectionName?: string;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: String })
  fileName?: string;

  @ApiPropertyOptional({ type: String })
  mimeType?: string;

  @ApiPropertyOptional({ type: Number })
  timeId?: number;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiPropertyOptional({ type: () => Time })
  time?: Time;

  @ApiProperty({ isArray: true, type: () => User })
  users: User[];
}
