import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import {
  CreateProjectDto,
  type PatchProjectDto,
} from "src/projects/dto/project.dto";
import { ProjectsService } from "src/projects/projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projects_service: ProjectsService) {}

  @Post()
  async add_one(@Body() project: CreateProjectDto) {
    return this.projects_service.add_one(project);
  }

  @Delete()
  async remove_one(@Param("id") id: number) {
    return this.projects_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return this.projects_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: number) {
    return this.projects_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: number, @Body() updates: PatchProjectDto) {
    return this.projects_service.patch_one(id, updates);
  }
}
