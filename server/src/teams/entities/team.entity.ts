import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";

import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

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

  @ManyToMany(() => Project, (project) => project.teams)
  projects: Project[];

  @ManyToMany(() => User, (user) => user.teams)
  users: User[];
}
