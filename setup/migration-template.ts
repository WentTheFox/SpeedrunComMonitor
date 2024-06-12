import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder) => {
  // UP
};

export const down = (pgm: MigrationBuilder) => {
  // DOWN
};
