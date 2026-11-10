import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ApiException } from '../common/exceptions/api.exception';
import { Member } from '../member/entities/member.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const member = await this.memberRepository
      .createQueryBuilder('member')
      .addSelect('member.password')
      .where('member.email = :email', { email: dto.email })
      .getOne();

    if (!member || !(await bcrypt.compare(dto.password, member.password))) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });

    return { nickname: member.nickname, accessToken };
  }
}
