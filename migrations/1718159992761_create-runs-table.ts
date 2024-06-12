import { ColumnDefinitions, MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder) => {
  pgm.createTable('runs', {
    id: {
      type: 'character varying(32)',
      notNull: true,
    },
    payload: {
      type: 'jsonb',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      default: PgLiteral.create('CURRENT_TIMESTAMP'),
      notNull: true,
    },
    updated_at: {
      type: 'timestamptz',
      default: PgLiteral.create('CURRENT_TIMESTAMP'),
      notNull: true,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('runs');
};
