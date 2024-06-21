import { WorkInterruption } from './work_interruption';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkInterruptionType {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => WorkInterruption })
  workInterruptions: WorkInterruption[];
}
