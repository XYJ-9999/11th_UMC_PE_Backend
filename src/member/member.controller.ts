import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentMemberId } from "../common/decorators/current-member.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MemberService } from "./member.service";
import { SignupDto } from "./dto/signup.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";

@ApiTags("회원")
@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: "회원가입", description: "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 공개 API이며 토큰이 필요하지 않습니다." })
  @ApiResponse({ status: 201, description: "회원가입 성공 (COMMON201)" })
  @ApiResponse({ status: 409, description: "이메일 또는 닉네임 중복 (MEMBER409_1)" })
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    return { isSuccess: true, code: "COMMON201", message: "회원가입에 성공했습니다.", result: await this.memberService.signup(dto) };
  }

  @ApiOperation({ summary: "이메일 중복 확인", description: "가입에 사용할 이메일의 사용 가능 여부를 조회합니다. 공개 API이며 토큰이 필요하지 않습니다." })
  @ApiResponse({ status: 200, description: "이메일 사용 가능 여부 반환" })
  @Get("email/:email")
  async checkEmailDuplicate(@Param("email") email: string) {
    return { available: await this.memberService.checkEmailDuplicate(email) };
  }

  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "내 정보 조회", description: "인증 토큰의 회원 정보를 조회합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 200, description: "회원 정보 조회 성공 (COMMON200)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 404, description: "회원을 찾을 수 없음 (MEMBER404_1)" })
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@CurrentMemberId() memberId: number) {
    return { isSuccess: true, code: "COMMON200", message: "회원 정보를 조회했습니다.", result: await this.memberService.getMyInfo(memberId) };
  }

  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "내 정보 수정", description: "인증 토큰의 회원 닉네임을 수정합니다. Bearer JWT 토큰이 필요합니다." })
  @ApiResponse({ status: 200, description: "회원 정보 수정 성공 (COMMON200)" })
  @ApiResponse({ status: 401, description: "토큰 누락 또는 인증 실패 (AUTH401_2 / AUTH401_3 / AUTH401_4)" })
  @ApiResponse({ status: 404, description: "회원을 찾을 수 없음 (MEMBER404_1)" })
  @ApiResponse({ status: 409, description: "이미 사용 중인 닉네임 (MEMBER409_1)" })
  @Patch("me")
  @UseGuards(JwtAuthGuard)
  async updateMyInfo(@CurrentMemberId() memberId: number, @Body() dto: UpdateMemberDto) {
    return { isSuccess: true, code: "COMMON200", message: "회원 정보를 수정했습니다.", result: await this.memberService.updateMyInfo(memberId, dto) };
  }
}
