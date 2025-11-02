import { ProviderDownloadFileResultType } from "../../types/provicer-download-file-result.type";
import { ProviderUploadResultType } from "../../types/provider-upload-file-result.type";
import { ProviderDeleteFileResultType } from "../../types/provider-delete-file-result.type";

export abstract class BaseProvider {
  abstract getBaseUrl(): string;
  abstract downloadFile(path: string): Promise<ProviderDownloadFileResultType>;
  abstract uploadFile(file: Express.Multer.File, dir: string): Promise<ProviderUploadResultType>;
  abstract deleteFile(path: string): Promise<ProviderDeleteFileResultType>;
}