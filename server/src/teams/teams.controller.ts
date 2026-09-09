import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { TeamsService } from "src/teams/teams.service";

import { CreateTeamDto, PatchTeamDto } from "src/teams/dto/team.dto";

@Controller("teams")
export class TeamsController {
  constructor(private readonly teams_service: TeamsService) {}

  @Post()
  async add_one(@Body() team: CreateTeamDto) {
    return await this.teams_service.add_one(team);
  }

  @Delete(":id")
  async remove_one(@Param("id") id: string) {
    return await this.teams_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return await this.teams_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: string) {
    return await this.teams_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: string, @Body() updates: PatchTeamDto) {
    return await this.teams_service.patch_one(id, updates);
  }
}
