import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateNotificationSettingsDto } from "../dto/request/create-notification-settings.dto";
import { NotificationSettingsResponseDto } from "../dto/response/notification-settings.response.dto";
import { CreateNotificationSettingsUseCase } from "../../application/use-cases/create-notification-settings.use-case";
import { GetNotificationSettingsByIdUseCase } from "../../application/use-cases/get-notification-settings-by-id.use-case";
import { GetAllNotificationSettingsQueryInput } from "../../application/inputs/get-all-notification-settings-query.input";
import { PaginationPipe } from "src/modules/shared/presentation/pipes/pagination.pipe";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { GetAllNotificationSettingsUseCase } from "../../application/use-cases/get-all-notification-settings.use-case";
import { UpdateNotificationSettingsUseCase } from "../../application/use-cases/update-notification-settings.use-case";
import { UpdateNotificationSettingsDto } from "../dto/request/update-notification-settings.dto";
import { AuthorizationGuard } from "src/modules/shared/presentation/guards/authorization.guard";
import { AcceptedCriteria } from "src/modules/shared/presentation/decorators/privileges.decorator";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";

@Controller({ path: 'settings/notifications', version: '1' })
export class NotificationSettingsController {
  constructor(
    private readonly getAllNotificationSettingsUseCase: GetAllNotificationSettingsUseCase,
    private readonly getNotificationSettingsByIdUseCase: GetNotificationSettingsByIdUseCase,
    private readonly createNotificationSettingsUseCase: CreateNotificationSettingsUseCase,
    private readonly updateNotificationSettingsUseCase: UpdateNotificationSettingsUseCase,
  ) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.NOTIFICATION_SETTINGS, actions: [ActionEnum.LIST, ActionEnum.SEARCH]} ] })
  async getAll(
    @Query() query: GetAllNotificationSettingsQueryInput,
    @Query() order: any,
    @Query(PaginationPipe) pagination: Pagination,
  ): Promise<{ data: NotificationSettingsResponseDto[]; count: number }> {
    const { models, count } = await this.getAllNotificationSettingsUseCase.execute(query, order, pagination);
    return {
      data: models.map((notificationSettings) => new NotificationSettingsResponseDto(notificationSettings)),
      count,
    };
  }
  
  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.NOTIFICATION_SETTINGS, actions: [ActionEnum.LIST, ActionEnum.SEARCH]} ] })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<NotificationSettingsResponseDto> {
    const notificationSettings = await this.getNotificationSettingsByIdUseCase.execute(id);
    return new NotificationSettingsResponseDto(notificationSettings);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.NOTIFICATION_SETTINGS, actions: [ActionEnum.ADD]} ] })
  async create(@Body() createNotificationSettingsDto: CreateNotificationSettingsDto): Promise<NotificationSettingsResponseDto> {
    const createdNotificationSettings = await this.createNotificationSettingsUseCase.execute(createNotificationSettingsDto);
    return new NotificationSettingsResponseDto(createdNotificationSettings);
  }

  @Patch(':id')
  @UseGuards(AuthorizationGuard)
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.NOTIFICATION_SETTINGS, actions: [ActionEnum.EDIT]} ] })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationSettingsDto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettingsResponseDto> {
    const updatedNotificationSettings = await this.updateNotificationSettingsUseCase.execute(id, updateNotificationSettingsDto);
    return new NotificationSettingsResponseDto(updatedNotificationSettings);
  }
}