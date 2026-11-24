import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,
} from "@nestjs/swagger";
import { CurrentMemberId } from "../common/decorators/current-member.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { RatingService } from "./rating.service";

@ApiTags("평점")
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: "유저별 평점 목록 조회", description: "특정 회원이 작성한 평점 목록을 최신순으로 조회합니다. 공개 API이며 토큰이 필요하지 않습니다." })
  @ApiResponse({ status: 200, description: "평점 목록 조회 성공" })
  @ApiResponse({ status: 400, description: "회원 ID 형식 오류 (COMMON400)" })
  @Get("members/:memberId/ratings")
  getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "평점 등록", description: "로그인한 회원이 영화에 1~10점의 평점과 선택 감상평을 등록합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 201, description: "평점 등록 성공 (COMMON201)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)", schema: { example: { isSuccess: false, code: "AUTH401_2", message: "로그인이 필요한 요청입니다.", result: null } } })
  @ApiResponse({ status: 404, description: "회원을 찾을 수 없음 (MEMBER404_1)", schema: { example: { isSuccess: false, code: "MEMBER404_1", message: "해당 회원을 찾을 수 없습니다.", result: null } } })
  @ApiResponse({ status: 409, description: "동일 회원이 같은 영화에 이미 평점을 등록함 (RATING409_1)", schema: { example: { isSuccess: false, code: "RATING409_1", message: "이미 이 영화에 평점을 남기셨습니다.", result: null } } })
  @ApiResponse({ status: 400, description: "요청 값 검증 실패 (COMMON400)" })
  @Post("ratings")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentMemberId() memberId: number, @Body() dto: CreateRatingDto) {
    return { isSuccess: true, code: "COMMON201", message: "평점을 등록했습니다.", result: await this.ratingService.create(memberId, dto) };
  }

  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "평점 수정", description: "로그인한 회원 본인이 작성한 평점의 점수 또는 감상평을 수정합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 200, description: "평점 수정 성공 (COMMON200)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 403, description: "다른 회원의 평점 수정 시도 (RATING403_1)", schema: { example: { isSuccess: false, code: "RATING403_1", message: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.", result: null } } })
  @ApiResponse({ status: 404, description: "평점을 찾을 수 없음 (RATING404_1)" })
  @Patch("ratings/:ratingId")
  @UseGuards(JwtAuthGuard)
  async update(@CurrentMemberId() memberId: number, @Param("ratingId", ParseIntPipe) ratingId: number, @Body() dto: UpdateRatingDto) {
    return { isSuccess: true, code: "COMMON200", message: "평점을 수정했습니다.", result: await this.ratingService.update(memberId, ratingId, dto) };
  }

  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "평점 삭제", description: "로그인한 회원 본인이 작성한 평점을 삭제합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 204, description: "평점 삭제 성공 (응답 본문 없음)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 403, description: "다른 회원의 평점 삭제 시도 (RATING403_1)", schema: { example: { isSuccess: false, code: "RATING403_1", message: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.", result: null } } })
  @ApiResponse({ status: 404, description: "평점을 찾을 수 없음 (RATING404_1)" })
  @Delete("ratings/:ratingId")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentMemberId() memberId: number, @Param("ratingId", ParseIntPipe) ratingId: number): Promise<void> {
    await this.ratingService.delete(memberId, ratingId);
  }
}
