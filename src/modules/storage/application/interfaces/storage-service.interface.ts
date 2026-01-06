import { UploadFileResultsType } from '../types/upload-file-results.type';

export interface IImageStorageService {
  getBaseUrl(): string;
  uploadOne(
    file: Express.Multer.File,
    dir: string,
  ): Promise<UploadFileResultsType>;
  uploadMany(
    files: Express.Multer.File[],
    dir: string,
  ): Promise<UploadFileResultsType[]>;
  deleteOne(path: string): Promise<void>;
  deleteMany(paths: string[]): Promise<void>;
}
