import { Injectable } from "@nestjs/common";
import { NotificationSettingsModel } from "../../domain/models/notification-settings.model";
import { NotificationSettingsFinderService } from "../services/notification-settings-finder.service";

@Injectable()
export class GetNotificationSettingsByIdUseCase {
  constructor(
    private readonly notificationSettingsFinderService: NotificationSettingsFinderService,
  ) {}

  execute(id: number): Promise<NotificationSettingsModel> {
    return this.notificationSettingsFinderService.getById(id);
  }
}
