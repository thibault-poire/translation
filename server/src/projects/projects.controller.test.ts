import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { ProjectsController } from "src/projects/projects.controller";

import { ProjectsService } from "src/projects/projects.service";

import { Project } from "src/projects/entities/project.entity";

import { CreateProjectDto, PatchProjectDto } from "src/projects/dto/project.dto";

import type { DeleteResult } from "typeorm";

describe("ProjectsController", () => {
  let controller: ProjectsController;
  let service: Partial<ProjectsService>;

  beforeEach(() => {
    service = {
      add_one: vi.fn(),
      delete_one: vi.fn(),
      get_all: vi.fn(),
      get_one: vi.fn(),
      patch_one: vi.fn(),
    } as unknown as Partial<ProjectsService>;

    controller = new ProjectsController(service as ProjectsService);
  });

  describe("add_one", () => {
    it("should return the created project", async () => {
      const dto = {
        name: "test",
      } as CreateProjectDto;

      const id = randomUUID();
      const new_project = { id, name: dto.name } as Project;

      vi.spyOn(service as ProjectsService, "add_one").mockResolvedValue(new_project);

      expect(await controller.add_one(dto)).toBe(new_project);
    });
  });

  describe("delete_one", () => {
    it("should return the correct deleted project depending on id", async () => {
      const id = randomUUID();
      const deleted_project = { raw: null } as DeleteResult;

      vi.spyOn(service as ProjectsService, "delete_one").mockResolvedValue(deleted_project);

      expect(await controller.remove_one(id)).toBe(deleted_project);
    });

    it("should throw an error if the project is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service as ProjectsService, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.remove_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return an array of projects", async () => {
      const projects = Array.apply({ length: 5 }).map(() => ({ id: randomUUID() }) as Project);

      vi.spyOn(service as ProjectsService, "get_all").mockResolvedValue(projects);

      expect(await controller.get_all()).toBe(projects);
    });
  });

  describe("get_one", () => {
    it("should return the correct project depending on id", async () => {
      const id = randomUUID();
      const project = { id } as Project;

      vi.spyOn(service as ProjectsService, "get_one").mockResolvedValue(project);

      expect(await controller.get_one(id)).toBe(project);
    });

    it("should throw an error if the project is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service as ProjectsService, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the correct updated project depending on id", async () => {
      const id = randomUUID();
      const project = { id } as Project;
      const to_update_project = {} as PatchProjectDto;

      vi.spyOn(service as ProjectsService, "patch_one").mockResolvedValue(project);

      expect(await controller.patch_one(id, to_update_project)).toBe(project);
    });

    it("should throw an error if the project is not found", async () => {
      const id = randomUUID();
      const to_update_project = {} as PatchProjectDto;

      vi.spyOn(service as ProjectsService, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(controller.patch_one(id, to_update_project)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
