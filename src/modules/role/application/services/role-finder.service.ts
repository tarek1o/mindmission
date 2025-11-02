import { Inject, Injectable } from "@nestjs/common";
import { ROLE_REPOSITORY } from "../constants/role-repository.constant";
import { IRoleRepository } from "../interfaces/role-repository.interface";
import { RoleWithTranslationsViewModel } from "../view-models/role-with-translations.view-model";
import { ResourceNotFoundError } from "src/modules/shared/domain/errors/resource-not-found.error";

@Injectable()
export class RoleFinderService {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async getWithTranslationsById(id: number): Promise<RoleWithTranslationsViewModel> {
    const roleWithTranslationsViewModel = await this.roleRepository.getByIdWithTranslations(id);
    if (!roleWithTranslationsViewModel) {
      throw new ResourceNotFoundError('role.not_found', { id });
    }
    return roleWithTranslationsViewModel;
  }
}