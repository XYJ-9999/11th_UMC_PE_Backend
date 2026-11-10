import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { ApiException } from '../common/exceptions/api.exception';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { memberId: number }>();
    const header = request.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_2',
        '로그인이 필요한 요청입니다.',
      );
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'AUTH401_2', '로그인이 필요한 요청입니다.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const memberId = Number(payload.sub);
      if (!Number.isInteger(memberId) || memberId <= 0) throw new Error('Invalid subject');
      request.memberId = memberId;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          'AUTH401_4',
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
        );
      }
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_3',
        '유효하지 않은 토큰입니다.',
      );
    }
  }
}
