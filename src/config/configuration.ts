import { Banner } from 'src/server/timing/entity/timing.entity';

// config/configuration.ts
export default () => ({
  type: 'mysql',
  host: process.env.HOST,
  port: 3306,
  username: process.env.USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'music',
  entities: [Banner],
  synchronize: true,
});
