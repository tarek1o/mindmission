import { Module } from '@nestjs/common';
import { IMAGE_STORAGE_SERVICE } from './application/constants/image-storage-service.constant';
import { ImageStorageService } from './infrastructure/services/image-storage.service';
import { S3Provider } from './infrastructure/providers/s3.provider';

@Module({
  providers: [
    S3Provider,
    {
      provide: IMAGE_STORAGE_SERVICE,
      useClass: ImageStorageService,
    },
  ],
  exports: [IMAGE_STORAGE_SERVICE],
})
export class StorageModule {}
