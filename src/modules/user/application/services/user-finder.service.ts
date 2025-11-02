import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { UserModel } from "../../domain/models/user.model";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { ResourceNotFoundError } from "src/modules/shared/domain/errors/resource-not-found.error";

@Injectable()
export class UserFinderService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  async getById(id: number): Promise<UserModel> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      this.logger.error(`User with id ${id} not found`, UserFinderService.name);
      throw new ResourceNotFoundError('user.not_found', { id });
    }
    return user;
  }
}