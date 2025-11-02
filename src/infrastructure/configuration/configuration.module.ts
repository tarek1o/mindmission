import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './validation/validation.config';
import { configuration } from './registration/register-as';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      expandVariables: true,
      isGlobal: true,
      cache: true,
      ignoreEnvVars: true,
    }),
  ],
})
export class ConfigurationModule {}
