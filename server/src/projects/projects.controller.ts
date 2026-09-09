import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { ProjectsService } from "src/projects/projects.service";

import { CreateProjectDto, PatchProjectDto } from "src/projects/dto/project.dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projects_service: ProjectsService) {}

  @Post()
  async add_one(@Body() project: CreateProjectDto) {
    return await this.projects_service.add_one(project);
  }

  @Delete(":id")
  async remove_one(@Param("id") id: string) {
    return await this.projects_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return await this.projects_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: string) {
    return await this.projects_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: string, @Body() updates: PatchProjectDto) {
    return await this.projects_service.patch_one(id, updates);
  }
}
