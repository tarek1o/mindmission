import { Readable } from 'stream';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import {S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AwsS3ConfigInterface } from 'src/infrastructure/configuration/interfaces/sub-interfaces/aws-s3-config.interface';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { IEnvironmentConfiguration } from 'src/infrastructure/configuration/interfaces/config.interface';
import { BaseProvider } from './base/base-provider';
import { ProviderDownloadFileResultType } from '../types/provicer-download-file-result.type';
import { ProviderUploadResultType } from '../types/provider-upload-file-result.type';
import { ProviderDeleteFileResultType } from '../types/provider-delete-file-result.type';
import { UnexpectedBehaviorError } from 'src/modules/shared/domain/errors/unexpected-behavior.error';

@Injectable()
export class S3Provider extends BaseProvider {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor(
    private readonly configService: ConfigService<IEnvironmentConfiguration>,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {
    super();
    const { bucket, ...reset } = this.configService.get<AwsS3ConfigInterface>('awsS3Config');
    this.bucket = bucket;
    this.region = reset.region;
    this.s3 = new S3Client(reset);
  }

  getBaseUrl(): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
  }

  private getKey(fileName: string, dir: string): string {
    return `${dir}/${uuid()}-${Date.now()}-${fileName}`;
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async downloadFile(path: string): Promise<ProviderDownloadFileResultType> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });
      const result = await this.s3.send(command);
      return {
        fileName: result.Metadata?.fileName,
        contentType: result.ContentType,
        size: result.ContentLength,
        data: await this.streamToBuffer(result.Body as Readable),
      }
    } catch (error) {
      this.logger.error(`Their are an error happened during get file by path (${path}): ${error.message}`, S3Provider.name);
      throw new UnexpectedBehaviorError('providers.s3.error.downloading-file');
    }
  }

  async uploadFile(file: Express.Multer.File, dir: string): Promise<ProviderUploadResultType> {
    try {
      const path = this.getKey(file.originalname, dir);
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      const result = await this.s3.send(command);
      return {
        baseUrl: this.getBaseUrl(),
        path,
        provider: S3Provider.name,
        metadata: {
          ETag: result.ETag,
          size: file.size,
          isPublic: true,
        },
      }
    } catch (error) {
      this.logger.error(`There was an error happened during uploading file: ${error}`, S3Provider.name);
      throw new UnexpectedBehaviorError('providers.s3.error.uploading-file');
    }
  }

  async deleteFile(path: string): Promise<ProviderDeleteFileResultType> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });
      const result = await this.s3.send(command);
      return {
        isDeleted: result.DeleteMarker,
        provider: S3Provider.name,
      }
    } catch (error) {
      this.logger.error(`There was an error happened during deleting file: ${error}`, S3Provider.name);
      throw new UnexpectedBehaviorError('providers.s3.error.deleting-file');
    }
  }
}