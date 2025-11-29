import { CanActivate, ExecutionContext, NotFoundException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAccessPolicy, IPrivilege } from '../interfaces/privilege.interface';
import { Privilege_Decorator_Key } from '../decorators/privileges.decorator';
import { LOGGER_SERVICE } from '../../application/constant/logger-service.constant';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';
import { UserSession } from '../interfaces/user-session.interface';
import { PermissionCacheViewModel } from 'src/modules/permission/application/view-models/permission-cache.view-model';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const request: RequestWithUser = gqlCtx.getContext().req;
    const { allowedUserTypes, privileges } = this.reflector.get<IAccessPolicy>(Privilege_Decorator_Key, context.getHandler());
    const isAuthorized = this.isUserHasRequiredUserTypes(request.user, allowedUserTypes) && this.isUserHasRequiredPrivileges(request.user, privileges);
    if(!isAuthorized) {
      this.logger.error(`User ${request.user.id} is not authorized to access this endpoint`, AuthGuard.name);
      throw new NotFoundException(`Cannot ${request.method} ${request.url}`);
    }
    return isAuthorized;
  };

  private isUserHasRequiredUserTypes(user: UserSession, allowedUserTypes: UserTypeEnum[]): boolean {
    return allowedUserTypes?.some(userType => user.types.includes(userType)) ?? true;
  }

  private isUserHasRequiredPrivileges(user: UserSession, privileges: IPrivilege[]): boolean {
    const userPermissions = user.roles.flatMap(role => role.permissions);
    return userPermissions.some(permission => this.isPermissionExistWithinRequiredPrivileges(privileges, permission));
  }

  private isPermissionExistWithinRequiredPrivileges(requiredPrivileges: IPrivilege[], permission: PermissionCacheViewModel): boolean {
    return requiredPrivileges?.some(privilege => permission.resource === privilege.resource && privilege.actions.some(action => permission.actions.includes(action))) ?? true;
  }
}
