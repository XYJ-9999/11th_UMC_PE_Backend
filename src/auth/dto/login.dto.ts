import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "가입한 이메일", example: "movie@example.com" })
  @IsEmail({}, { message: "이메일 형식이 올바르지 않습니다." })
  email: string;

  @ApiProperty({ description: "가입한 비밀번호", example: "Movie123!" })
  @IsString()
  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  password: string;
}
