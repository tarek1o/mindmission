import { IncomingHttpHeaders } from 'http2';

export class HeadersModel {
  language: string;
  ip: string;
  userAgent: string;

  constructor(props: IncomingHttpHeaders) {
    this.language = props['accept-language'] as string;
    this.ip = props['x-forwarded-for'] as string;
    this.userAgent = props['user-agent'] as string;
  }
}
