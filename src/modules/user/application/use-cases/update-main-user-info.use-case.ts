import { Inject, Injectable } from "@nestjs/common";
import { GetUserByIdUseCase } from "./get-user-by-id.use-case";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { UpdateMainUserInfoInput } from "../inputs/update-main-user-info.input";
import { UserModel } from "../../domain/models/user.model";

@Injectable()
export class UpdateMainUserInfoUseCase {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, updateMainUserInfoInput: UpdateMainUserInfoInput): Promise<UserModel> {
    const user = await this.getUserByIdUseCase.execute(id);
    user.update({
      firstName: updateMainUserInfoInput.firstName,
      lastName: updateMainUserInfoInput.lastName,
      mobilePhone: updateMainUserInfoInput.mobilePhone,
      whatsAppNumber: updateMainUserInfoInput.whatsAppNumber,
      picture: updateMainUserInfoInput.picture,
    });
    return this.userRepository.save(user);
  }
}