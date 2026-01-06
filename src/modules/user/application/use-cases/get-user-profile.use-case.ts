import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants/user-repository.constant';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IMAGE_STORAGE_SERVICE } from 'src/modules/storage/application/constants/image-storage-service.constant';
import { IImageStorageService } from 'src/modules/storage/application/interfaces/storage-service.interface';
import { UserProfileInfoViewModel } from '../view-models/user-profile-info.view.model';
import { ResourceNotFoundError } from 'src/modules/shared/domain/errors/resource-not-found.error';

export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly imageStorageService: IImageStorageService,
  ) {}

  private async attachBaseUrlToProfileImage(
    profile: UserProfileInfoViewModel,
  ): Promise<UserProfileInfoViewModel> {
    profile.picture = profile.picture
      ? `${this.imageStorageService.getBaseUrl()}/${profile.picture}`
      : profile.picture;
    return profile;
  }

  async execute(id: number): Promise<UserProfileInfoViewModel> {
    const profile = await this.userRepository.getProfileById(id);
    if (!profile) {
      throw new ResourceNotFoundError('user.not_found', { id });
    }
    return this.attachBaseUrlToProfileImage(profile);
  }
}
