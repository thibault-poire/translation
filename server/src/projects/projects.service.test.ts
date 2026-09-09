import { randomUUID } from "crypto";
import { In } from "typeorm";

import { NotFoundException } from "@nestjs/common";

import { ProjectsService } from "src/projects/projects.service";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";

import { CreateProjectDto, PatchProjectDto } from "src/projects/dto/project.dto";

import type { DeleteResult, ObjectLiteral, Repository } from "typeorm";

describe("ProjectsService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
    }) as unknown as Repository<T>;

  let service: ProjectsService;
  let project_repository: Repository<Project>;
  let language_repository: Repository<Language>;
  let team_repository: Repository<Team>;
  let key_repository: Repository<Key>;

  beforeEach(() => {
    project_repository = repository_mock<Project>();
    language_repository = repository_mock<Language>();
    team_repository = repository_mock<Team>();
    key_repository = repository_mock<Key>();

    service = new ProjectsService(
      project_repository,
      language_repository,
      team_repository,
      key_repository,
    );
  });

  describe("add_one", () => {
    it("should return the saved project with default language, teams, and keys relations", async () => {
      const default_language_id = randomUUID();
      const team_id = randomUUID();
      const key_id = randomUUID();
      const language = { id: default_language_id } as Language;
      const team = { id: team_id } as Team;
      const key = { id: key_id } as Key;
      const project = { name: "test" } as Project;

      const updates = {
        name: "test",
        default_language_id,
        team_ids: [team_id],
        key_ids: [key_id],
      } as CreateProjectDto;

      vi.mocked(language_repository.findOneBy).mockResolvedValue(language);
      vi.mocked(team_repository.findBy).mockResolvedValue([team]);
      vi.mocked(key_repository.findBy).mockResolvedValue([key]);
      vi.mocked(project_repository.save).mockResolvedValue(project);

      expect(await service.add_one(updates)).toBe(project);

      expect(language_repository.findOneBy).toHaveBeenCalledWith({ id: default_language_id });
      expect(team_repository.findBy).toHaveBeenCalledWith({ id: In([team_id]) });
      expect(key_repository.findBy).toHaveBeenCalledWith({ id: In([key_id]) });
      expect(project_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          default_language: language,
          teams: [team],
          keys: [key],
          name: "test",
        }),
      );
    });
  });

  describe("delete_one", () => {
    it("should return deleted project", async () => {
      const id = randomUUID();
      const deleted_project = { raw: null } as DeleteResult;

      vi.mocked(project_repository.delete).mockResolvedValue(deleted_project);

      expect(await service.delete_one(id)).toBe(deleted_project);
      expect(project_repository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe("get_all", () => {
    it("should return all projects with default language and teams relations", async () => {
      const projects = [{ id: randomUUID() }, { id: randomUUID() }] as Project[];

      vi.mocked(project_repository.find).mockResolvedValue(projects);

      expect(await service.get_all()).toBe(projects);
      expect(project_repository.find).toHaveBeenCalledWith({
        relations: { default_language: true, teams: true },
      });
    });
  });

  describe("get_one", () => {
    it("should return the matching project with default language and teams relations", async () => {
      const id = randomUUID();
      const project = { id } as Project;

      vi.mocked(project_repository.findOne).mockResolvedValue(project);

      expect(await service.get_one(id)).toBe(project);
      expect(project_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { default_language: true, teams: true },
      });
    });

    it("should throw an error if project is not found", async () => {
      const id = randomUUID();

      vi.mocked(project_repository.findOne).mockResolvedValue(null);

      await expect(service.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should update the project and apply default language, teams, and keys relations", async () => {
      const id = randomUUID();
      const default_language_id = randomUUID();
      const team_id = randomUUID();
      const key_id = randomUUID();
      const project = { id } as Project;
      const language = { id: default_language_id } as Language;
      const team = { id: team_id } as Team;
      const key = { id: key_id } as Key;

      const updates = {
        name: "updated",
        default_language_id,
        team_ids: [team_id],
        key_ids: [key_id],
      } as PatchProjectDto;

      const saved_project = { id } as Project;

      vi.mocked(project_repository.findOne).mockResolvedValue(project);
      vi.mocked(language_repository.findOneBy).mockResolvedValue(language);
      vi.mocked(team_repository.findBy).mockResolvedValue([team]);
      vi.mocked(key_repository.findBy).mockResolvedValue([key]);
      vi.mocked(project_repository.save).mockResolvedValue(saved_project);

      expect(await service.patch_one(id, updates)).toBe(saved_project);

      expect(project_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { teams: true, keys: true },
      });

      expect(language_repository.findOneBy).toHaveBeenCalledWith({ id: default_language_id });
      expect(team_repository.findBy).toHaveBeenCalledWith({ id: In([team_id]) });
      expect(key_repository.findBy).toHaveBeenCalledWith({ id: In([key_id]) });

      expect(project_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "updated",
          default_language: language,
          teams: [team],
          keys: [key],
        }),
      );
    });

    it("should throw an error if project is not found", async () => {
      const id = randomUUID();
      const updates = { name: "test" } as PatchProjectDto;

      vi.mocked(project_repository.findOne).mockResolvedValue(null);

      await expect(service.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
