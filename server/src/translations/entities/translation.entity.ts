import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from "typeorm";

import { Key } from "src/keys/entities/key.entity";

@Entity()
@Unique(["key", "language_tag"])
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  value: string;

  @Column({ length: 5 })
  language_tag: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "now()",
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "now()",
  })
  updated_at: Date;

  @ManyToOne(() => Key, (key) => key.translations)
  key: Key;
}
