import { BadRequestException, Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid4 } from 'uuid';
import { IEnvironmentConfiguration } from '../configuration/interfaces/config.interface';
import { AppUiEnum } from 'src/modules/shared/domain/enums/app-ui.enum';
import { UILinks } from '../configuration/interfaces/sub-interfaces/ui-links.interface';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { HeadersModel } from 'src/modules/shared/presentation/models/headers.model';

@Injectable()
export class DomainHeadersMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<IEnvironmentConfiguration>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  private readonly originApplicationUIMap: Record<string, AppUiEnum> = {
    [this.configService.get<UILinks>('uiLinks').dashboard.origin]: AppUiEnum.DASHBOARD,
    [this.configService.get<UILinks>('uiLinks').mainApp.origin]: AppUiEnum.MAIN_APP,
  };

  use(request: Request, _response: Response, next: NextFunction) {
    request.headers['x-request-id'] = uuid4();
    request.headers['x-application-ui'] = this.originApplicationUIMap[request.hostname] ?? request.headers['x-application-ui'];
    this.loggerService.log(`Request Info: ${JSON.stringify(new HeadersModel(request.headers))}`);
    if (!request.headers['x-application-ui']) {
      throw new BadRequestException('X-Application-UI header is required');
    }
    next();
  }
}
