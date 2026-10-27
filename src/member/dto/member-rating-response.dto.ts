export class MemberRatingResponseDto {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(input: {
    ratingId: number | string;
    movieId: number | string;
    score: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.ratingId = Number(input.ratingId);
    this.movieId = Number(input.movieId);
    this.score = input.score;
    this.comment = input.comment;
    this.createdAt = input.createdAt.toISOString().slice(0, 19);
    this.updatedAt = input.updatedAt.toISOString().slice(0, 19);
  }
}
