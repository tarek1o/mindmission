import { Injectable } from '@nestjs/common';
import { RoleFinderService } from '../services/role-finder.service';
import { RoleWithTranslationsViewModel } from '../view-models/role-with-translations.view-model';

@Injectable()
export class GetRoleWithTranslationsByIdUseCase {
  constructor(private readonly roleFinderService: RoleFinderService) {}

  execute(id: number): Promise<RoleWithTranslationsViewModel> {
    return this.roleFinderService.getWithTranslationsById(id);
  }
}
