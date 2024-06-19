import { Times } from './times';
import { Users } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Medias {
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

  @ApiPropertyOptional({ type: () => Times })
  time?: Times;

  @ApiProperty({ isArray: true, type: () => Users })
  users: Users[];
}
