import { Body, Controller, Get, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUserProfileUseCase } from "../../application/use-cases/get-user-profile.use-case";
import { UpdateMainUserInfoUseCase } from "../../application/use-cases/update-main-user-info.use-case";
import { ChangeEmailUseCase } from "../../application/use-cases/change-email.use-case";
import { CompleteChangeEmailUseCase } from "../../application/use-cases/complete-change.email.use-case";
import { ChangePasswordUseCase } from "../../application/use-cases/change-password.use-case";
import { ChangeProfileImageUseCase } from "../../application/use-cases/change-profile-image.use-case";
import { User } from "src/modules/shared/presentation/decorators/user-decorator";
import { UserSession } from "src/modules/shared/presentation/interfaces/user-session.interface";
import { UserProfileInfoViewModel } from "../../application/view-models/user-profile-info.view.model";
import { UpdateMainUserInfoDto } from "../dto/request/update-main-user-info.dto";
import { UserDetailsResponseDto } from "../dto/response/user-details.response.dto";
import { ChangeEmailDto } from "../dto/request/change-email.dto";
import { CompleteChangeEmailDto } from "../dto/request/complete-change-email.dto";
import { ChangePasswordDto } from "../dto/request/change-password.dto";
import { CustomParseFilePipe } from "src/modules/shared/presentation/pipes/custom-parse-file.pipe";
import { ImageFileEnum } from "src/modules/storage/application/enums/image-file.enum";
import { NotEmptyArray } from "src/infrastructure/types/not-empty-array.type";
import { configService } from "src/infrastructure/configuration/services/config-instance.service";

@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateMainUserInfoUseCase: UpdateMainUserInfoUseCase,
    private readonly changeEmailUseCase: ChangeEmailUseCase,
    private readonly completeChangeEmailUseCase: CompleteChangeEmailUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly changeProfileImageUseCase: ChangeProfileImageUseCase,
  ) {}

  @Get()
  async getUserProfile(
    @User() user: UserSession,
  ): Promise<UserProfileInfoViewModel> {
    return this.getUserProfileUseCase.execute(user.id);
  }

  @Patch()
  async updateMainUserInfo(
    @User() user: UserSession,
    @Body() updateMainUserInfo: UpdateMainUserInfoDto,
  ): Promise<UserDetailsResponseDto> {
    const userModel = await this.updateMainUserInfoUseCase.execute(user.id, updateMainUserInfo);
    return new UserDetailsResponseDto(userModel);
  }

  @Patch('email')
  changeEmail(
    @User() user: UserSession,
    @Body() changeEmail: ChangeEmailDto,
  ): Promise<void> {
    return this.changeEmailUseCase.execute(user.id, changeEmail);
  }

  @Patch('email/complete')
  completeChangeEmail(
    @Body() completeChangeEmail: CompleteChangeEmailDto,
  ): Promise<void> {
    return this.completeChangeEmailUseCase.execute(completeChangeEmail.token);
  }
  
  @Patch('password')
  changePassword(
    @User() user: UserSession,
    @Body() changePassword: ChangePasswordDto,
  ): Promise<void> {
    return this.changePasswordUseCase.execute(user.id, changePassword);
  }

  @Patch('image')
  @UseInterceptors(FileInterceptor('file'))
  changeProfileImage(
    @User() user: UserSession, 
    @UploadedFile(new CustomParseFilePipe({ 
      allowedTypes: Object.values(ImageFileEnum) as NotEmptyArray<ImageFileEnum>, 
      maxSizeInMB: configService.getNumber('STORAGE_IMAGE_PROFILE_IMAGES_MAX_SIZE'),
      isRequired: true,
    })) file: Express.Multer.File,
  ): Promise<void> {
    return this.changeProfileImageUseCase.execute(user.id, file);
  }
}