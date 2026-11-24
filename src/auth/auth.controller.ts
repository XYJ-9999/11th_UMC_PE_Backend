import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "이메일 로그인", description: "이메일과 비밀번호로 로그인하고 Access Token을 발급받습니다. 공개 API이며 토큰이 필요하지 않습니다." })
  @ApiResponse({ status: 200, description: "로그인 성공 (COMMON200)" })
  @ApiResponse({ status: 401, description: "이메일 또는 비밀번호 오류 (AUTH401_1)" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "로그인에 성공했습니다.",
      result: await this.authService.login(dto),
    };
  }
}
