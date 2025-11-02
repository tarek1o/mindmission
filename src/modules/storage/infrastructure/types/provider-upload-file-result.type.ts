export type ProviderUploadResultType = {
  baseUrl: string;
  path: string;
  provider: string;
  metadata?: {
    ETag?: string;
    size?: number;
    isPublic?: boolean;
  }
};