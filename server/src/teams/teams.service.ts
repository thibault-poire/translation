import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { In, Repository } from "typeorm";

import { Project } from "src/projects/entities/project.entity";
import { CreateTeamDto, PatchTeamDto } from "src/teams/dto/team.dto";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly team_repository: Repository<Team>,
    @InjectRepository(Project)
    private readonly project_repository: Repository<Project>,
    @InjectRepository(User)
    private readonly user_repository: Repository<User>,
  ) {}

  async add_one({ project_ids, user_ids, ...properties }: CreateTeamDto) {
    const projects = project_ids?.length
      ? { users: await this.project_repository.findBy({ id: In(project_ids) }) }
      : {};

    const users = user_ids?.length
      ? { users: await this.user_repository.findBy({ id: In(user_ids) }) }
      : {};

    return await this.team_repository.save({
      ...properties,
      ...projects,
      ...users,
    });
  }

  async delete_one(id: number) {
    return await this.team_repository.delete(id);
  }

  async get_all() {
    return await this.team_repository.find({ relations: { users: true } });
  }

  async get_one(id: number) {
    const team = await this.team_repository.find({
      where: { id },
      relations: { users: true },
    });

    if (!team) {
      throw new NotFoundException();
    }

    return team;
  }

  async patch_one(
    id: number,
    { project_ids, user_ids, ...updates }: PatchTeamDto,
  ) {
    const team = await this.team_repository.findOne({
      where: { id },
      relations: { projects: true, users: true },
    });

    if (!team) {
      throw new NotFoundException();
    }

    const projects = project_ids?.length
      ? { users: await this.project_repository.findBy({ id: In(project_ids) }) }
      : {};

    const users = user_ids?.length
      ? { users: await this.user_repository.findBy({ id: In(user_ids) }) }
      : {};

    return await this.team_repository.save({
      ...team,
      ...updates,
      ...projects,
      ...users,
    });
  }
}
