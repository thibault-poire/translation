import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Project } from "src/projects/entities/project.entity";

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
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

  @OneToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;
}
