import { Inject, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, QueryFailedError, Repository } from "typeorm";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { LanguageEnum } from "../../../../shared/domain/enums/language.enum";
import { IRoleTranslationRepository } from "../../../application/interfaces/role-translation-repository.interface";
import { RoleTranslationEntity } from "../entities/role-translation.entity";
import { RoleTranslationModel } from "../../../domain/models/role-translation.model";
import { GetRoleTranslationByLanguageViewModel } from "src/modules/role/application/view-models/get-role-translation-by-language.view-model";
import { SlugifyHelper } from "src/modules/shared/infrastructure/helpers/slugify.helper";
import { GetRoleTranslationByNameViewModel } from "src/modules/role/application/view-models/get-role-translation-by-name.view-model";
import { RoleTranslationMapper } from "../mappers/role-translation.mapper";
import { ErrorMappingResult } from "src/modules/shared/infrastructure/database/types/error-mapping-result.type";
import { ConflictError } from "src/modules/shared/domain/errors/conflict.error";

export class RoleTranslationRepository implements IRoleTranslationRepository {
  constructor(
    @InjectRepository(RoleTranslationEntity) private readonly roleTranslationEntity: Repository<RoleTranslationEntity>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  async getByLanguage(language: LanguageEnum): Promise<GetRoleTranslationByLanguageViewModel[]> {
    const roleTranslationEntities = await this.roleTranslationEntity.find({
      where: {
        language,
      },
      select: {
        name: true,
        roleId: true,
      }
    });
    return roleTranslationEntities.map(({ name, roleId }) => ({ name, roleId }));
  }

  async getByNameAndLanguageExcludingRoleId(parameters: {language: LanguageEnum, name: string}[], roleId?: number): Promise<GetRoleTranslationByNameViewModel[]> {
    const qb = this.roleTranslationEntity.createQueryBuilder('translations')
    parameters.forEach(({ name, language }, index) => {
      const condition = `(
        translations.slug = :slug${index}
        AND 
        translations.language = :language${index}
        AND
        ${roleId ? 'translations.roleId != :roleId' : '1=1'}
      )`;
      qb.orWhere(condition, {
        [`slug${index}`]: SlugifyHelper.slugify(name),
        [`language${index}`]: language,
        roleId,
      });
    });

    const roleTranslationEntities = await qb.select([
      'translations.language',
      'translations.name',
      'translations.roleId',
    ]).getMany();

    return roleTranslationEntities.map(({ language, name, roleId }) => ({ language, name, roleId }));
  }

  async saveMany(translations: RoleTranslationModel[], manager?: EntityManager): Promise<RoleTranslationModel[]> {
    try {
    const roleTranslationEntities = translations.map(translation => RoleTranslationMapper.toEntity(translation));
      const roleTranslationEntity = manager?.getRepository(RoleTranslationEntity) ?? this.roleTranslationEntity;
      const savedEntities = await roleTranslationEntity.save(roleTranslationEntities);
      return savedEntities.map(entity => RoleTranslationMapper.toModel(entity));
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint: 'role_translations_language_name_partial_unique_index',
        error: new ConflictError('role.translations.name.duplicate'),
      },
    ];
    const errorException = errorMappingResult.find(errorException => (error as any).driverError.constraint === errorException.constraint);
    throw errorException?.error ?? error;
  }

  async deleteMany(translations: RoleTranslationModel[], manager?: EntityManager): Promise<void> {
    const ids = translations.map(translation => translation.id);
    const roleTranslationEntity = manager?.getRepository(RoleTranslationEntity) ?? this.roleTranslationEntity;
    const deleteResults = await roleTranslationEntity.delete(ids);
    if (deleteResults.affected !== translations.length) {
      this.loggerService.warn(`Failed to delete ${deleteResults.affected}/${translations.length} role translations`, RoleTranslationRepository.name);
    }
  }
}