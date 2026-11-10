import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentMemberId } from '../common/decorators/current-member.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MemberService } from './member.service';
import { SignupDto } from './dto/signup.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result: await this.memberService.signup(dto),
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@CurrentMemberId() memberId: number) {
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result: await this.memberService.getMyInfo(memberId),
    };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyInfo(
    @CurrentMemberId() memberId: number,
    @Body() dto: UpdateMemberDto,
  ) {
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result: await this.memberService.updateMyInfo(memberId, dto),
    };
  }
}
