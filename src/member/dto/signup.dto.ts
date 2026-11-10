import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @Length(2, 40, { message: '닉네임은 2자 이상 40자 이하여야 합니다.' })
  nickname: string;

  @IsString()
  @Length(8, 72, { message: '비밀번호는 8자 이상 72자 이하여야 합니다.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 각각 포함해야 합니다.',
  })
  password: string;
}
