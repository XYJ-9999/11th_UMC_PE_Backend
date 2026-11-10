import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  score?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
