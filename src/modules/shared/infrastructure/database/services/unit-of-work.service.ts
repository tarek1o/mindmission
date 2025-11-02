import { HttpException, Inject, Injectable, LoggerService } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { TRANSLATION_SERVICE } from "src/modules/shared/application/constant/translation-service.constant";
import { ITranslationService } from "src/modules/shared/application/interfaces/translation-service.interface";
import { BaseDomainError } from "src/modules/shared/domain/errors/base/base-domain.error";

@Injectable()
export class UnitOfWorkService implements IUnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    @Inject(TRANSLATION_SERVICE) private readonly translationService: ITranslationService
  ) {}

  async transaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      try {
        return await callback(manager);
      } catch(error: unknown) {
        this.errorHandler(error);
      }
    });
  }

  private isHandledError(error: unknown): boolean {
    return error instanceof BaseDomainError || error instanceof HttpException;
  }

  private errorHandler(error: unknown) {
    if(this.isHandledError(error)) {
      throw error;
    }
    this.logger.error(`something went wrong while executing transaction: ${error}`, UnitOfWorkService.name);
    throw new Error(this.translationService.translate('errors.global.unit_of_work.transaction_failed'));
  }
}