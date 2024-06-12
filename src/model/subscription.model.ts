import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  serverId: string;

  @Column()
  channelId: string;

  @Column()
  gameId: string;

  @Column()
  active: boolean;

  @Column()
  template: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
