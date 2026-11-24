import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentMemberId } from "../common/decorators/current-member.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateFavoriteDto } from "../rating/dto/create-favorite.dto";
import { FavoriteService } from "./favorite.service";

@ApiTags("즐겨찾기")
@ApiBearerAuth("bearerAuth")
@Controller("favorites")
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({ summary: "내 즐겨찾기 목록 조회", description: "로그인한 회원이 등록한 모든 즐겨찾기를 최신순으로 조회합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 200, description: "즐겨찾기 목록 조회 성공 (COMMON200)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @Get()
  async getMyFavorites(@CurrentMemberId() memberId: number) {
    return { isSuccess: true, code: "COMMON200", message: "즐겨찾기 목록을 조회했습니다.", result: await this.favoriteService.getMyFavorites(memberId) };
  }

  @ApiOperation({ summary: "즐겨찾기 여부 조회", description: "로그인한 회원이 지정한 TMDB 영화 ID를 즐겨찾기했는지 확인합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 200, description: "즐겨찾기 여부 조회 성공 (isFavorite 반환)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @Get(":movieId")
  async getStatus(@CurrentMemberId() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    return { isSuccess: true, code: "COMMON200", message: "즐겨찾기 여부를 조회했습니다.", result: await this.favoriteService.getStatus(memberId, movieId) };
  }

  @ApiOperation({ summary: "즐겨찾기 등록", description: "로그인한 회원의 즐겨찾기에 TMDB 영화 ID를 추가합니다. 경로 파라미터 또는 요청 본문 방식으로 호출할 수 있습니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 201, description: "즐겨찾기 등록 성공 (COMMON201)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 409, description: "이미 등록된 즐겨찾기 (FAVORITE409_1)", schema: { example: { isSuccess: false, code: "FAVORITE409_1", message: "이미 이 영화를 즐겨찾기하셨습니다.", result: null } } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFromBody(@CurrentMemberId() memberId: number, @Body() dto: CreateFavoriteDto) {
    return { isSuccess: true, code: "COMMON201", message: "즐겨찾기를 등록했습니다.", result: await this.favoriteService.create(memberId, dto.movieId) };
  }

  @ApiOperation({ summary: "즐겨찾기 등록 (영화 ID 경로)", description: "로그인한 회원의 즐겨찾기에 경로의 TMDB 영화 ID를 추가합니다. 프론트엔드 경로 방식과 호환됩니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 201, description: "즐겨찾기 등록 성공 (COMMON201)" })
  @ApiResponse({ status: 409, description: "이미 등록된 즐겨찾기 (FAVORITE409_1)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @Post(":movieId")
  @HttpCode(HttpStatus.CREATED)
  async createFromPath(@CurrentMemberId() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    return { isSuccess: true, code: "COMMON201", message: "즐겨찾기를 등록했습니다.", result: await this.favoriteService.create(memberId, movieId) };
  }

  @ApiOperation({ summary: "즐겨찾기 해제", description: "로그인한 회원의 즐겨찾기에서 지정한 영화를 제거합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 204, description: "즐겨찾기 해제 성공 (응답 본문 없음)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 404, description: "즐겨찾기 항목을 찾을 수 없음 (FAVORITE404_1)" })
  @Delete(":movieId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentMemberId() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    await this.favoriteService.delete(memberId, movieId);
  }
}
