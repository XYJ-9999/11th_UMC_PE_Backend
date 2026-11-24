import { ApiProperty } from "@nestjs/swagger";
import { Favorite } from "../../member/entities/favorite.entity";

export class FavoriteResponseDto {
  @ApiProperty({ example: 1 })
  favoriteId: number;

  @ApiProperty({ example: 550 })
  movieId: number;

  @ApiProperty({ example: "2026-11-24T12:00:00.000Z" })
  createdAt: Date;

  static from(favorite: Favorite): FavoriteResponseDto {
    return {
      favoriteId: favorite.favoriteId,
      movieId: favorite.movieId,
      createdAt: favorite.createdAt,
    };
  }
}
