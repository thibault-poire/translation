import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";

@Entity()
@Unique(["key", "language"])
export class Translation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  value: string;

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

  @ManyToOne(() => Language, (language) => language.translations)
  @JoinColumn({ name: "language_id" })
  language: Language;

  @ManyToOne(() => Key, (key) => key.translations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "key_id" })
  key: Key;
}
