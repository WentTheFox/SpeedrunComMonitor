import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'character varying' })
  gameId: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'character varying' })
  locale: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
