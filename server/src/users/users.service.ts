import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { In, Repository } from "typeorm";

import { Team } from "src/teams/entities/team.entity";
import { CreateUserDto, type PatchUserDto } from "src/users/dto/user.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user_repository: Repository<User>,
    @InjectRepository(Team)
    private readonly team_repository: Repository<Team>,
  ) {}

  async add_one({ team_ids, ...properties }: CreateUserDto) {
    const teams = team_ids?.length
      ? { teams: await this.team_repository.findBy({ id: In(team_ids) }) }
      : {};

    return this.user_repository.save({ ...properties, ...teams });
  }

  async delete_one(id: number) {
    return this.user_repository.delete(id);
  }

  async get_all() {
    const projects = await this.user_repository.find({
      relations: { teams: true },
    });

    return projects;
  }

  async get_one(id: number) {
    const project = await this.user_repository.findOne({
      where: { id },
      relations: { teams: true },
    });

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  async patch_one(id: number, { team_ids, ...updates }: PatchUserDto) {
    const user = await this.user_repository.findOne({
      where: { id },
      relations: { teams: true },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const teams = team_ids?.length
      ? { teams: await this.team_repository.findBy({ id: In(team_ids) }) }
      : {};

    return this.user_repository.save({ ...user, ...updates, ...teams });
  }
}
