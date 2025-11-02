require('dotenv').config();
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariableNames } from '../constant/environment-variable-names';

class ConfigurationService {
  private configService = new ConfigService<typeof EnvironmentVariableNames>();

  getString(key: keyof typeof EnvironmentVariableNames): string {
    return this.configService.get<string>(key);
  }

  getNumber(key: keyof typeof EnvironmentVariableNames): number {
    const value = this.configService.get<string>(key);
    return value ? parseInt(value, 10) : undefined;
  }

  getBoolean(key: keyof typeof EnvironmentVariableNames): boolean {
    const value = this.configService.get<string>(key);
    return value ? value.toLowerCase() === 'true' : undefined;
  }
}

export const configService = new ConfigurationService();
