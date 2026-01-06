import { IncomingHttpHeaders } from 'http2';
import { AppUiEnum } from '../../domain/enums/app-ui.enum';

export class HeadersModel {
  applicationUi: AppUiEnum;
  language: string;
  ip: string;
  userAgent: string;
  requestId: string;

  constructor(props: IncomingHttpHeaders) {
    this.language = (props['accept-language'] as string) ?? null;
    this.ip = (props['x-forwarded-for'] as string) ?? null;
    this.userAgent = (props['user-agent'] as string) ?? null;
    this.applicationUi = (props['x-application-ui'] as AppUiEnum) ?? null;
    this.requestId = (props['x-request-id'] as string) ?? null;
  }
}
