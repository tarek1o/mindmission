export interface ITemplateContext {
  [key: string]: any;
}

export interface IEmailTemplateContext extends ITemplateContext {
  name?: string;
  email?: string;
  link?: string;
  url?: string;
  code?: string;
  resetPasswordTokenExpirationTime?: string;
  [key: string]: any;
} 