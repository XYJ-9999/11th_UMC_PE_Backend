import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '../common/dto/api-response.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto): Promise<ApiResponse<MemberResponseDto>> {
    const member = await this.memberService.signUp(dto);
    return ApiResponse.success('COMMON201', '회원가입에 성공했습니다.', member);
  }
}
