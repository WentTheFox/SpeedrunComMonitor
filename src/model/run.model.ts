import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'runs' })
export class Run {
  @PrimaryColumn({ type: 'character varying', length: 32 })
  id: string;

  @Column()
  subscriptionId: number;

  @Column({ type: 'jsonb' })
  payload: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
