import { FileValidator, UnsupportedMediaTypeException } from '@nestjs/common';
import mediaFileValidator from 'magic-bytes.js';
import { NotEmptyArray } from 'src/infrastructure/types/not-empty-array.type';

export class FileSignatureValidator extends FileValidator {
  constructor(private readonly allowedTypes: NotEmptyArray<string>) {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const fileSignatures = mediaFileValidator(file.buffer).map(
      ({ mime }) => mime,
    );
    return fileSignatures.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    throw new UnsupportedMediaTypeException(
      `Invalid file signature, allowed file signatures are ${Object.values(this.allowedTypes).join(', ')}`,
    );
  }
}
