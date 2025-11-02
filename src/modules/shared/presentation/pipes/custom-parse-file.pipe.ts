import { FileTypeValidator, HttpStatus, Injectable, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { FileSignatureValidator } from '../validators/file-signature.validator';
import { NotEmptyArray } from 'src/infrastructure/types/not-empty-array.type';
import { DocumentFileEnum } from '../enums/document-file.enum';
import { ImageFileEnum } from '../enums/image-file.enum';
import { VideoFileEnum } from '../enums/video-file.enum';
import { AudioTypeEnum } from '../enums/audio-file.enum';

@Injectable()
export class CustomParseFilePipe extends ParseFilePipe {
  constructor(options: {
    maxSizeInMB: number;
    allowedTypes: NotEmptyArray<
      ImageFileEnum | VideoFileEnum | AudioTypeEnum | DocumentFileEnum
    >;
    isRequired?: boolean;
  }) {
    super({
      errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      fileIsRequired: options.isRequired || false,
      validators: [
        new MaxFileSizeValidator({
          maxSize: options.maxSizeInMB * 1024 * 1024,
          message: (maxSize: number) =>
            `The maximum file size allowed is ${maxSize / (1024 * 1024)}MB`,
        }),
        new FileTypeValidator({
          fileType: options.allowedTypes.join('|'),
        }),
        new FileSignatureValidator(options.allowedTypes),
      ],
    });
  }
}