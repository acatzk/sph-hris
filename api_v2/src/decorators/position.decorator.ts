import { PositionEnum, PositionHelper } from '@/enums/position.enum';
import { SetMetadata } from '@nestjs/common';

export const Position = (...position: PositionEnum[] | PositionHelper[]) =>
  SetMetadata('position', position);
