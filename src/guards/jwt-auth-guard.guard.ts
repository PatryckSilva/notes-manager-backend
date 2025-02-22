import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersRepository } from 'src/domain/users/users.repository';
import { TokenService } from 'src/infra/token/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject(UsersRepository) private usersRepository: UsersRepository;
  @Inject(TokenService) private tokenService: TokenService;
  @Inject(CACHE_MANAGER) private cacheService: Cache;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const { cookie } = request.headers;

    const tokenFromHeader = authHeader
      ? this.extractTokenFromHeader(authHeader)
      : null;

    const tokenFromCookie = cookie || null;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decoded: { id: string; message?: string } =
      this.tokenService.verifyToken(token);

    if (!decoded?.id) {
      throw new UnauthorizedException(decoded?.message);
    }

    const cacheKey = `user-${decoded.id}`;

    const cachedUser = await this.cacheService.get(cacheKey);

    if (cachedUser) {
      request.user = cachedUser;
      return true;
    }

    const user = await this.usersRepository.findUserById(decoded.id);

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    await this.cacheService.set(cacheKey, user, { ttl: 60 } as any);

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(authHeader: any): string | undefined {
    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
