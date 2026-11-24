import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateRatingDto {
  @ApiPropertyOptional({ description: "수정할 평점 (1~10점)", example: 8, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  score?: number;

  @ApiPropertyOptional({ description: "수정할 감상평 (최대 2000자)", example: "다시 보니 더 좋았습니다." })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
