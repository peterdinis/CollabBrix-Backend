import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class SortNotesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['title', 'createdAt'], {
    message: "sortBy must be 'title' or 'createdAt'",
  })
  sortBy?: 'title' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: "order must be 'asc' or 'desc'" })
  order?: 'asc' | 'desc' = 'desc';
}
