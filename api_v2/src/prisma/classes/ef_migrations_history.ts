import { ApiProperty } from '@nestjs/swagger';

export class EfMigrationsHistory {
  @ApiProperty({ type: String })
  migrationId: string;

  @ApiProperty({ type: String })
  productVersion: string;
}
