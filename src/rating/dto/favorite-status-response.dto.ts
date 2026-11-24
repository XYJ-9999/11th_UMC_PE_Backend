import { ApiProperty } from "@nestjs/swagger";

export class FavoriteStatusResponseDto {
  @ApiProperty({ example: true, description: "즐겨찾기 등록 여부" })
  isFavorite: boolean;

  static from(isFavorite: boolean): FavoriteStatusResponseDto {
    return { isFavorite };
  }
}
