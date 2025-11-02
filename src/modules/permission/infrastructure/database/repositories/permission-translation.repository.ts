import { Inject, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, QueryFailedError, Repository } from "typeorm";
import { IPermissionTranslationRepository } from "../../../application/interfaces/permission-translation-repository.interface";
import { PermissionTranslationModel } from "../../../domain/models/permission-translation.model";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { PermissionTranslationEntity } from "../entities/permission-translation.entity";
import { LanguageEnum } from "../../../../shared/domain/enums/language.enum";
import { SlugifyHelper } from "src/modules/shared/infrastructure/helpers/slugify.helper";
import { GetPermissionTranslationByLanguageViewModel } from "src/modules/permission/application/view-models/get-permission-translation-by-language.view-model";
import { GetPermissionTranslationByNameViewModel } from "src/modules/permission/application/view-models/get-permission-translation-by-name.view-model";
import { PermissionTranslationMapper } from "../mappers/permission-translation.mapper";
import { ErrorMappingResult } from "src/modules/shared/infrastructure/database/types/error-mapping-result.type";
import { ConflictError } from "src/modules/shared/domain/errors/conflict.error";

export class PermissionTranslationRepository implements IPermissionTranslationRepository {
  constructor(
    @InjectRepository(PermissionTranslationEntity) private readonly permissionTranslationEntity: Repository<PermissionTranslationEntity>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  async getByLanguage(language: LanguageEnum): Promise<GetPermissionTranslationByLanguageViewModel[]> {
    const permissionTranslationEntities = await this.permissionTranslationEntity.find({
      where: {
        language,
      },
      select: {
        name: true,
        permissionId: true,
      }
    });
    return permissionTranslationEntities.map(({ name, permissionId }) => ({ name, permissionId }));
  }

  async getByNameAndLanguageExcludingPermissionId(translations: {language: LanguageEnum, name: string}[], permissionId?: number): Promise<GetPermissionTranslationByNameViewModel[]> {
    const qb = this.permissionTranslationEntity.createQueryBuilder('translations')
    translations.forEach(({ name, language }, index) => {
      const condition = `(
        translations.slug = :slug${index}
        AND 
        translations.language = :language${index}
        AND
        ${permissionId ? 'translations.permissionId != :permissionId' : '1=1'}
      )`;
      qb.orWhere(condition, {
        [`slug${index}`]: SlugifyHelper.slugify(name),
        [`language${index}`]: language,
        permissionId,
      });
    });

    const permissionTranslationEntities = await qb.select([
      'translations.language',
      'translations.name',
    ]).getMany();

    return permissionTranslationEntities.map(({ language, name }) => ({ language, name }));
  }

  async saveMany(translations: PermissionTranslationModel[], manager?: EntityManager): Promise<PermissionTranslationModel[]> {
    try {
      const permissionTranslationEntities = translations.map(translation => PermissionTranslationMapper.toEntity(translation));
      const permissionTranslationEntity = manager?.getRepository(PermissionTranslationEntity) ?? this.permissionTranslationEntity;
      const savedPermissionTranslationEntities = await permissionTranslationEntity.save(permissionTranslationEntities);
      return savedPermissionTranslationEntities.map(entity => PermissionTranslationMapper.toModel(entity));
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint: 'permission_translations_language_name_partial_unique_index',
        error: new ConflictError('permission.translations.name.duplicate'),
      },
    ];
    const errorException = errorMappingResult.find(errorException => (error as any).driverError.constraint === errorException.constraint);
    throw errorException?.error ?? error;
  }

  async deleteMany(translations: PermissionTranslationModel[], manager?: EntityManager): Promise<void> {
    const ids = translations.map(translation => translation.id);
    const permissionTranslationEntity = manager?.getRepository(PermissionTranslationEntity) ?? this.permissionTranslationEntity;
    const deleteResults = await permissionTranslationEntity.delete(ids);
    if (deleteResults.affected !== translations.length) {
      this.loggerService.warn(`Failed to delete ${deleteResults.affected}/${translations.length} permission translations`, PermissionTranslationRepository.name);
    }
  }
}