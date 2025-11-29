import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ROLE_REPOSITORY } from "src/modules/role/application/constants/role-repository.constant";
import { IRoleRepository } from "src/modules/role/application/interfaces/role-repository.interface";
import { RoleModel } from "src/modules/role/domain/models/role.model";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { InvalidInputError } from "src/modules/shared/domain/errors/invalid-input.error";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";

@Injectable()
export class UserValidatorService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  async checkEmailDuplicate(email: string, appUi: AppUiEnum, id?: number): Promise<void> {
    const user = await this.userRepository.getByEmailExceptId(email, appUi, id);
    if (user) {
      this.logger.error(`Email: ${email} already exists`);
      throw new InvalidInputError('user.email.duplicate');
    }
  }

  async validateRoles(rolesIds: number[]): Promise<RoleModel[]> {
    const roles = await this.roleRepository.getByIds(rolesIds);
    if (roles.length !== rolesIds.length) {
      this.logger.error('Some roles not found');
      throw new InvalidInputError('user.roles.partial_missing');
    }
    return roles;
  }
} 