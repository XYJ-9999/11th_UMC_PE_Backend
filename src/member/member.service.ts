import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';
import { ApiException } from '../common/exceptions/api.exception';
import { MemberResponseDto } from './dto/member-response.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.memberRepository.findOne({
      where: [{ email: dto.email }, { nickname: dto.nickname }],
    });
    if (existing) {
      const message =
        existing.email === dto.email
          ? '이미 사용 중인 이메일입니다.'
          : '이미 사용 중인 닉네임입니다.';
      throw new ApiException(HttpStatus.CONFLICT, 'MEMBER409_1', message);
    }

    const member = this.memberRepository.create({
      email: dto.email,
      nickname: dto.nickname,
      password: await bcrypt.hash(dto.password, 10),
    });

    try {
      const saved = await this.memberRepository.save(member);
      return { memberId: saved.memberId, email: saved.email, nickname: saved.nickname, createdAt: saved.createdAt };
    } catch (error) {
      // UNIQUE 제약은 동시 회원가입 요청도 막아준다.
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ApiException(HttpStatus.CONFLICT, 'MEMBER409_1', '이미 사용 중인 이메일 또는 닉네임입니다.');
      }
      throw error;
    }
  }

  async getMyInfo(memberId: number): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({ where: { memberId } });
    if (!member) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');
    }
    return MemberResponseDto.from(member);
  }

  async updateMyInfo(memberId: number, dto: UpdateMemberDto): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({ where: { memberId } });
    if (!member) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');
    }
    const duplicate = await this.memberRepository.findOne({
      where: { nickname: dto.nickname, memberId: Not(memberId) },
    });
    if (duplicate) {
      throw new ApiException(HttpStatus.CONFLICT, 'MEMBER409_1', '이미 사용 중인 닉네임입니다.');
    }
    member.nickname = dto.nickname;
    try {
      await this.memberRepository.save(member);
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ApiException(HttpStatus.CONFLICT, 'MEMBER409_1', '이미 사용 중인 닉네임입니다.');
      }
      throw error;
    }
    return MemberResponseDto.from(member);
  }
}
