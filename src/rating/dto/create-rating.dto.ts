import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  movieId: number;

  @IsInt()
  @Min(1)
  @Max(10)
  score: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
