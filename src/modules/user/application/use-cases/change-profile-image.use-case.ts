import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IMAGE_STORAGE_SERVICE } from "src/modules/storage/application/constants/image-storage-service.constant";
import { IImageStorageService } from "src/modules/storage/application/interfaces/storage-service.interface";
import { UserFinderService } from "../services/user-finder.service";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { StorageConfiguration } from "src/infrastructure/configuration/interfaces/sub-interfaces/storage-configuration.interface";
import { UserModel } from "../../domain/models/user.model";

@Injectable()
export class ChangeProfileImageUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(IMAGE_STORAGE_SERVICE) private readonly imageStorageService: IImageStorageService,
    private readonly configService: ConfigService<IEnvironmentConfiguration>,
  ) {}

  private async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    const { dir } = this.configService.get<StorageConfiguration>('storage').image.profileImages;
    const { path } = await this.imageStorageService.uploadOne(file, dir);
    return path;
  }

  private async deleteProfileImage(user: UserModel): Promise<void> {
    user.picture && (await this.imageStorageService.deleteOne(user.picture));
  }
  
  async execute(id: number, file: Express.Multer.File): Promise<void> {
    const user = await this.userFinderService.getById(id);
    const path = await this.uploadProfileImage(file);
    await this.deleteProfileImage(user);
    user.update({
      picture: path,
    });
    await this.userRepository.save(user);
  }
}