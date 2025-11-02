export type ProviderDownloadFileResultType = {
  fileName: string;
  contentType: string;
  size: number;
  data: Buffer<ArrayBufferLike>;
};