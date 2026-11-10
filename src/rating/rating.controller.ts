import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentMemberId } from '../common/decorators/current-member.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingService } from './rating.service';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 공개 API: 특정 회원이 작성한 평점 목록 조회
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post('ratings')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentMemberId() memberId: number,
    @Body() dto: CreateRatingDto,
  ) {
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result: await this.ratingService.create(memberId, dto),
    };
  }

  @Patch('ratings/:ratingId')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentMemberId() memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result: await this.ratingService.update(memberId, ratingId, dto),
    };
  }

  @Delete('ratings/:ratingId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentMemberId() memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ): Promise<void> {
    await this.ratingService.delete(memberId, ratingId);
  }
}
