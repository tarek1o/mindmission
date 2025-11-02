import { Inject, Injectable } from "@nestjs/common";
import { INotificationSettingsRepository } from "../interfaces/notification-settings-repository.interface";
import { NOTIFICATION_SETTINGS_REPOSITORY } from "../constants/notification-settings-repository.constant";
import { GetAllNotificationSettingsQueryInput } from "../inputs/get-all-notification-settings-query.input";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { AllowedNotificationSettingsOrderColumnsEnum } from "../enums/allowed-notification-settings-order-columns.enum";
import { NotificationSettingsModel } from "../../domain/models/notification-settings.model";

@Injectable()
export class GetAllNotificationSettingsUseCase {
  constructor(
    @Inject(NOTIFICATION_SETTINGS_REPOSITORY) private readonly notificationSettingsRepository: INotificationSettingsRepository,
  ) {}

  async execute(
    query: GetAllNotificationSettingsQueryInput,
    order: IOrder<AllowedNotificationSettingsOrderColumnsEnum>,
    pagination: Pagination,
  ): Promise<{ models: NotificationSettingsModel[], count: number }> {
    return this.notificationSettingsRepository.getAllPaginatedAndTotalCount(query, order, pagination);
  }
}
