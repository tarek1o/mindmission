import { Injectable } from '@nestjs/common';
import { S3Provider } from '../providers/s3.provider';
import { IImageStorageService } from '../../application/interfaces/storage-service.interface';
import { UploadFileResultsType } from '../../application/types/upload-file-results.type';

@Injectable()
export class ImageStorageService implements IImageStorageService {
  constructor(private readonly provider: S3Provider) {}

  getBaseUrl(): string {
    return this.provider.getBaseUrl();
  }

  async uploadOne(
    file: Express.Multer.File,
    dir: string,
  ): Promise<UploadFileResultsType> {
    const result = await this.provider.uploadFile(file, dir);
    return {
      baseUrl: result.baseUrl,
      path: result.path,
    };
  }

  uploadMany(
    files: Express.Multer.File[],
    dir: string,
  ): Promise<UploadFileResultsType[]> {
    return Promise.all(files.map(async (file) => this.uploadOne(file, dir)));
  }

  async deleteOne(path: string): Promise<void> {
    const result = await this.provider.deleteFile(path);
  }

  async deleteMany(paths: string[]): Promise<void> {
    await Promise.all(paths.map(async (path) => this.deleteOne(path)));
  }
}
