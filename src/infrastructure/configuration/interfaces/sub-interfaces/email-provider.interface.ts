export interface EmailProvider {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}
