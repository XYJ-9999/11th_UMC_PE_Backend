import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateRatingDto {
  @ApiProperty({ description: "TMDB 영화 ID", example: 550 })
  @IsInt()
  @Min(1)
  movieId: number;

  @ApiProperty({ description: "평점 (1~10점)", example: 9, minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;

  @ApiPropertyOptional({ description: "영화 감상평 (최대 2000자)", example: "몰입감 있는 영화였습니다." })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
