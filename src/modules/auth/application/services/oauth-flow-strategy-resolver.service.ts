import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UserModel } from 'src/modules/user/domain/models/user.model';
import { OAuthFlowEnum } from '../enums/oauth-flow.enum';
import { OAuthFlowStrategy } from '../use-cases/oauth/strategies/base/oauth-flow-strategy';
import { UnexpectedBehaviorError } from 'src/modules/shared/domain/errors/unexpected-behavior.error';

@Injectable()
export class OAuthFlowStrategyResolverService {
  constructor(private readonly moduleRef: ModuleRef) {}

  private getOAuthFlowType(user: UserModel | null): OAuthFlowEnum {
    return user ? OAuthFlowEnum.LOGIN : OAuthFlowEnum.SIGNUP;
  }

  private getOAuthFlowStrategyService(flow: OAuthFlowEnum): OAuthFlowStrategy {
    try {
      return this.moduleRef.get<OAuthFlowStrategy>(flow);
    } catch (error) {
      throw new UnexpectedBehaviorError('auth.oauth.flow.not_found', { flow });
    }
  }

  resolve(user: UserModel | null): OAuthFlowStrategy {
    const flow = this.getOAuthFlowType(user);
    return this.getOAuthFlowStrategyService(flow);
  }
}
