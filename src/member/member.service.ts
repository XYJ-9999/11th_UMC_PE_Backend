import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signUp(dto: CreateMemberDto): Promise<MemberResponseDto> {
    if (await this.memberRepository.exist({ where: { email: dto.email } })) {
      throw new ConflictException({
        code: 'MEMBER4091',
        message: '이미 사용 중인 이메일입니다.',
      });
    }
    if (await this.memberRepository.exist({ where: { nickname: dto.nickname } })) {
      throw new ConflictException({
        code: 'MEMBER4092',
        message: '이미 사용 중인 닉네임입니다.',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const member = this.memberRepository.create({
      email: dto.email,
      nickname: dto.nickname,
      password: passwordHash,
    });
    const saved = await this.memberRepository.save(member);

    // 응답 DTO에 password 속성 자체를 만들지 않음.
    return new MemberResponseDto(saved.memberId, saved.email, saved.nickname);
  }
}
