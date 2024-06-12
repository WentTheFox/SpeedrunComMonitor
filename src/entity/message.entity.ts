import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'character varying' })
  subscriptionId: string;

  @Column({ type: 'character varying' })
  runId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
