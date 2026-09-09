import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TeamsController } from "src/teams/teams.controller";

import { TeamsService } from "src/teams/teams.service";

import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Team, Project, User])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
