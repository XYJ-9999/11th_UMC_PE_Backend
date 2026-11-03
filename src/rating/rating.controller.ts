import {
  BadRequestException, Body, Controller, Delete, Headers, HttpCode, HttpStatus,
  Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { ApiResponse } from '../common/dto/api-response.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRatingDto) {
    const result = await this.ratingService.create(dto);
    return ApiResponse.success('COMMON201', '평점 등록에 성공했습니다.', result);
  }

  // 6주차 실습은 로그인 전 단계이므로 x-member-id 헤더로 요청 회원을 구분함.
  // 7주차 인증 도입 시 이 값을 JWT에서 가져오도록 교체할 것.
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-member-id') memberIdHeader: string,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = this.parseMemberId(memberIdHeader);
    const result = await this.ratingService.update(id, memberId, dto);
    return ApiResponse.success('COMMON200', '평점 수정에 성공했습니다.', result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-member-id') memberIdHeader: string,
  ): Promise<void> {
    const memberId = this.parseMemberId(memberIdHeader);
    await this.ratingService.delete(id, memberId);
  }

  private parseMemberId(value?: string): number {
    const id = Number(value);
    if (!value || !Number.isInteger(id) || id < 1) {
      // Nest가 공통 예외 필터를 통해 400 JSON으로 반환
      throw new BadRequestException('x-member-id 헤더에 올바른 회원 ID를 입력해주세요.');
    }
    return id;
  }
}
