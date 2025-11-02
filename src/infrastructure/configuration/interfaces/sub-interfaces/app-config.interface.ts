import { EnvironmentEnum } from '../../enums/environments.enum';

export interface AppConfigInterface {
  port: number;
  mode: EnvironmentEnum;
  name: string;
}
