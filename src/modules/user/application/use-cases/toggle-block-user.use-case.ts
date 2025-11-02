import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { UserFinderService } from "../services/user-finder.service";
import { ForceLogoutService } from "../services/force-logout.service";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { UserModel } from "../../domain/models/user.model";

@Injectable()
export class ToggleBlockUserUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly forceLogoutService: ForceLogoutService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async applyBlockToggle(user: UserModel): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.userRepository.save(user, manager);
      user.isBlocked && await this.forceLogoutService.execute(user.id, manager);
    });
  }

  async execute(id: number): Promise<void> {
    const user = await this.userFinderService.getById(id);
    user.toggleBlock();
    await this.applyBlockToggle(user);
  }
}