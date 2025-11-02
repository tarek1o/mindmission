import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { UserModel } from "../../domain/models/user.model";
import { UserValidatorService } from "../services/user-validator.service";
import { UserFinderService } from "../services/user-finder.service";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { ForceLogoutService } from "../services/force-logout.service";

@Injectable()
export class UpdateUserRolesUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly userValidatorService: UserValidatorService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly forceLogoutService: ForceLogoutService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async applyRoleUpdate(user: UserModel): Promise<UserModel> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.forceLogoutService.execute(user.id, manager);
      return this.userRepository.save(user, manager);
    });
  }

  async execute(id: number, rolesIds: number[]): Promise<UserModel> {
    const user = await this.userFinderService.getById(id);
    const roles = await this.userValidatorService.validateRoles(rolesIds);
    user.roles = roles;
    return this.applyRoleUpdate(user);
  }
}