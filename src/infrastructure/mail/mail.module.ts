import * as path from 'path';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { IEnvironmentConfiguration } from '../configuration/interfaces/config.interface';
import { EmailProvider } from '../configuration/interfaces/sub-interfaces/email-provider.interface';
import { AppConfigInterface } from '../configuration/interfaces/sub-interfaces/app-config.interface';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IEnvironmentConfiguration>) => {
        const { host, port, auth } =
          configService.get<EmailProvider>('emailProvider');
        const { name: appName } =
          configService.get<AppConfigInterface>('appConfig');
        return {
          transport: {
            host,
            port,
            secure: true,
            auth,
          },
          defaults: {
            from: `${appName} <${host}>`,
          },
          template: {
            dir: path.join(
              __dirname,
              '../../modules/notification/infrastructure/providers/mail/templates',
            ),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class MailModule {}
