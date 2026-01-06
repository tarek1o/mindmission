import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/modules/user/application/constants/user-repository.constant';
import { ProviderProfileInput } from '../../../inputs/provider-profile.input';
import { OAuthFlowStrategy } from './base/oauth-flow-strategy';
import { IUserRepository } from 'src/modules/user/application/interfaces/user-repository.interface';
import { UserModel } from 'src/modules/user/domain/models/user.model';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { OAUTH_PROVIDER_REPOSITORY } from '../../../constants/oauth-provider-repository.constant';
import { IOAuthProviderRepository } from '../../../interfaces/oauth-provider-repository.interface';
import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';
import { PasswordHashingHelper } from 'src/modules/shared/application/helpers/password-hashing.helper';
import { PasswordGeneratorHelper } from 'src/modules/shared/application/helpers/password-generator.helper';

@Injectable()
export class OAuthSignupFlowStrategy extends OAuthFlowStrategy {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(OAUTH_PROVIDER_REPOSITORY)
    private readonly oauthProviderRepository: IOAuthProviderRepository,
  ) {
    super();
  }

  private async constructUserModel(
    providerProfile: ProviderProfileInput,
  ): Promise<UserModel> {
    const password = PasswordGeneratorHelper.generate();
    return new UserModel({
      firstName: providerProfile.firstName,
      lastName: providerProfile.lastName,
      email: providerProfile.email,
      isEmailVerified: true,
      password: await PasswordHashingHelper.hash(password),
      picture: providerProfile.picture,
      types: [UserTypeEnum.STUDENT],
    });
  }

  async handle(providerProfile: ProviderProfileInput): Promise<UserModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const userModel = await this.constructUserModel(providerProfile);
      const savedUser = await this.userRepository.save(userModel, manager);
      const oAuthProviderModel = this.constructOAuthProviderModel(
        providerProfile,
        savedUser.id,
      );
      await this.oauthProviderRepository.save(oAuthProviderModel, manager);
      return savedUser;
    });
  }
}
