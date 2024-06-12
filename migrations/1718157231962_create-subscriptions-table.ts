import { ColumnDefinitions, MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder) => {
  pgm.createTable('subscriptions', {
    id: {
      type: 'uuid',
      default: PgLiteral.create('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    gameId: {
      type: 'character varying(32)',
      notNull: true,
    },
    active: {
      type: 'boolean',
      default: true,
      notNull: true,
    },
    locale: {
      type: 'character varying(12)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamptz',
      default: PgLiteral.create('CURRENT_TIMESTAMP'),
      notNull: true,
    },
    updatedAt: {
      type: 'timestamptz',
      default: PgLiteral.create('CURRENT_TIMESTAMP'),
      notNull: true,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('subscriptions');
};
