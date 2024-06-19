import { WorkInterruptions } from './work_interruptions';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkInterruptionTypes {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ isArray: true, type: () => WorkInterruptions })
  workInterruptions: WorkInterruptions[];
}
