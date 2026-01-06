import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ActionTokenService } from 'src/modules/action-token/application/services/action-token.service';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { AccessTokenPayload } from 'src/modules/auth/application/types/access-token-payload.type';
import { UserSession } from '../interfaces/user-session.interface';
import { IPermissionCacheService } from 'src/modules/permission/application/interfaces/permission-cache-service.interface';
import { PERMISSION_CACHE } from 'src/modules/permission/application/constants/permission-cache.constant';
import { ROLE_CACHE } from 'src/modules/role/application/constants/role-cache.constant';
import { IRoleCacheService } from 'src/modules/role/application/interfaces/role-cache.service.interface';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { PermissionCacheViewModel } from 'src/modules/permission/application/view-models/permission-cache.view-model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly actionTokensService: ActionTokenService,
    @Inject(ROLE_CACHE) private readonly roleCacheService: IRoleCacheService,
    @Inject(PERMISSION_CACHE)
    private readonly permissionCacheService: IPermissionCacheService,
  ) {}

  async use(
    request: RequestWithUser,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = this.extractToken(request);
    const payload = await this.validateToken(token);
    request.user = await this.loadUser(payload);
    next();
  }

  private extractToken(req: Request): string {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  }

  private async validateToken(token: string): Promise<AccessTokenPayload> {
    try {
      const actionToken =
        await this.actionTokensService.verify<AccessTokenPayload>(
          ActionTokenTypeEnum.ACCESS_TOKEN,
          token,
        );
      return actionToken.payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async loadRoles(
    roles: number[],
  ): Promise<
    {
      id: number;
      permissions: PermissionCacheViewModel[];
      isDeletable: boolean;
    }[]
  > {
    const roleCacheViewModels = roles.length
      ? await this.roleCacheService.getMany(roles)
      : [];
    return Promise.all(
      roleCacheViewModels.map(async (role) => ({
        id: Number(role.id),
        permissions: await this.permissionCacheService.getMany(
          role.permissions,
        ),
        isDeletable: role.isDeletable,
      })),
    );
  }

  private async loadUser(payload: AccessTokenPayload): Promise<UserSession> {
    const roles = await this.loadRoles(payload.roles);
    return {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      types: payload.types,
      roles,
    };
  }
}
