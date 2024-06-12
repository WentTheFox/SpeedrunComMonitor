import { DataSource } from 'typeorm';
import { Message } from './entity/message.entity';
import { Subscription } from './entity/subscription.entity';
// @ts-expect-error The type definitions are wrong, this is how it is actually exposed
import parse from 'pg-connection-string';

export const createAppDataSource = (): DataSource => {
  const databaseUrl = process.env.DATABASE_URL;
  if (typeof databaseUrl !== 'string') {
    throw new Error('Missing database URL environment variable');
  }

  const parsedConnectionString = parse(databaseUrl);
  return new DataSource({
    type: 'postgres',
    host: parsedConnectionString.host,
    port: parsedConnectionString.port ? Number(parsedConnectionString.port) : undefined,
    username: parsedConnectionString.user,
    password: parsedConnectionString.password,
    database: parsedConnectionString.database,
    synchronize: false,
    migrationsRun: false,
    logging: false,
    entities: [Message, Subscription],
    migrations: [],
    subscribers: [],
  });
};
