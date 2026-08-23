import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateTeamDto, PatchTeamDto } from "src/teams/dto/team.dto";
import { TeamsService } from "src/teams/teams.service";

@Controller("teams")
export class TeamsController {
  constructor(private readonly teams_service: TeamsService) {}

  @Post()
  async add_one(@Body() project: CreateTeamDto) {
    return this.teams_service.add_one(project);
  }

  @Delete()
  async remove_one(@Param("id") id: number) {
    return this.teams_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return this.teams_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: number) {
    return this.teams_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: number, @Body() updates: PatchTeamDto) {
    return this.teams_service.patch_one(id, updates);
  }
}
