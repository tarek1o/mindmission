import { Inject, Injectable } from '@nestjs/common';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { USER_REPOSITORY } from '../constants/user-repository.constant';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { ForceLogoutService } from '../services/force-logout.service';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { UserModel } from '../../domain/models/user.model';
import { UserFinderService } from '../services/user-finder.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly forceLogoutService: ForceLogoutService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async applyDeletion(user: UserModel): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.userRepository.save(user, manager);
      await this.forceLogoutService.execute(user.id, manager);
    });
  }

  async execute(id: number): Promise<void> {
    const user = await this.userFinderService.getById(id);
    user.markAsDeleted();
    await this.applyDeletion(user);
  }
}
