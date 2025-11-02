import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from '../configuration/services/config-instance.service';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.getString('DB_HOST'),
  port: configService.getNumber('DB_PORT'),
  username: configService.getString('DB_USERNAME'),
  password: configService.getString('DB_PASSWORD'),
  database: configService.getString('DB_NAME'),
  migrations: [configService.getString('DB_MIGRATIONS')],
  entities: [configService.getString('DB_ENTITIES')],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
