export class RatingResponseDto {
  ratingId: number;
  memberId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: Date;
}
