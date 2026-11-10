import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from '../common/exceptions/api.exception';
import { Member } from '../member/entities/member.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getRatingsByMember(memberId: number) {
    return this.ratingRepository.find({
      where: { member: { memberId } },
      order: { createdAt: 'DESC' },
      select: {
        ratingId: true,
        movieId: true,
        score: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(memberId: number, dto: CreateRatingDto) {
    const member = await this.memberRepository.findOne({ where: { memberId } });
    if (!member) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');
    }
    const duplicated = await this.ratingRepository.findOne({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (duplicated) {
      throw new ApiException(HttpStatus.CONFLICT, 'RATING409_1', '이미 이 영화에 평점을 남기셨습니다.');
    }

    const rating = this.ratingRepository.create({
      member,
      movieId: dto.movieId,
      score: dto.score,
      comment: dto.comment ?? null,
    });
    try {
      const saved = await this.ratingRepository.save(rating);
      return this.toResponse(saved);
    } catch (error) {
      // 복합 UNIQUE 제약이 동시에 들어온 중복 요청의 마지막 방어선이다.
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ApiException(HttpStatus.CONFLICT, 'RATING409_1', '이미 이 영화에 평점을 남기셨습니다.');
      }
      throw error;
    }
  }

  async update(memberId: number, ratingId: number, dto: UpdateRatingDto) {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });
    if (!rating) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'RATING404_1', '해당 평점을 찾을 수 없습니다.');
    }
    if (rating.member.memberId !== memberId) {
      throw new ApiException(HttpStatus.FORBIDDEN, 'RATING403_1', '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.');
    }
    if (dto.score !== undefined) rating.score = dto.score;
    if (dto.comment !== undefined) rating.comment = dto.comment;
    const saved = await this.ratingRepository.save(rating);
    return this.toResponse(saved);
  }

  async delete(memberId: number, ratingId: number): Promise<void> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });
    if (!rating) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'RATING404_1', '해당 평점을 찾을 수 없습니다.');
    }
    if (rating.member.memberId !== memberId) {
      throw new ApiException(HttpStatus.FORBIDDEN, 'RATING403_1', '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.');
    }
    await this.ratingRepository.remove(rating);
  }

  private toResponse(rating: Rating) {
    return {
      ratingId: rating.ratingId,
      memberId: rating.member.memberId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    };
  }
}
