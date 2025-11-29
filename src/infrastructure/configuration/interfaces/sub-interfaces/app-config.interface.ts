import { EnvironmentEnum } from '../../enums/environments.enum';

export interface AppConfigInterface {
  port: number;
  mode: EnvironmentEnum;
  name: string;
  graphql: {
    path: string;
    sortSchema: boolean;
    introspection: boolean;
  };
}
