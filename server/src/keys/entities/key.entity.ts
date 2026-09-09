import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
} from "typeorm";

import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

@Entity()
@Unique(["project", "name"])
export class Key {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

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

  @ManyToOne(() => Project, (project) => project.keys)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @OneToMany(() => Translation, (translation) => translation.key)
  translations: Translation[];
}
