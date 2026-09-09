import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
  @JoinTable({
    name: "project_team",
    joinColumn: {
      name: "team_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "project_id",
      referencedColumnName: "id",
    },
  })
  projects: Project[];

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({
    name: "team_user",
    joinColumn: {
      name: "team_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  users: User[];
}
