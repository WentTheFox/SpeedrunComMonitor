import { ColumnDefinitions, MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder) => {
  pgm.createTable('messages', {
    id: {
      type: 'bigint',
      notNull: true,
      primaryKey: true,
    },
    subscriptionId: {
      type: 'uuid',
      notNull: true,
    },
    runId: {
      type: 'character varying(32)',
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
  pgm.addConstraint('messages', null, {
    foreignKeys: {
      columns: 'subscriptionId',
      references: 'subscriptions(id)',
    },
    cascade: true,
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('messages');
};
