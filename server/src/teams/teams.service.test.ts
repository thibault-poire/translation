import { randomUUID } from "crypto";
import { In } from "typeorm";

import { NotFoundException } from "@nestjs/common";

import { TeamsService } from "src/teams/teams.service";

import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

import { CreateTeamDto, PatchTeamDto } from "src/teams/dto/team.dto";

import type { DeleteResult, ObjectLiteral, Repository } from "typeorm";

describe("TeamsService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      save: vi.fn(),
    }) as unknown as Repository<T>;

  let service: TeamsService;
  let team_repository: Repository<Team>;
  let project_repository: Repository<Project>;
  let user_repository: Repository<User>;

  beforeEach(() => {
    team_repository = repository_mock<Team>();
    project_repository = repository_mock<Project>();
    user_repository = repository_mock<User>();

    service = new TeamsService(team_repository, project_repository, user_repository);
  });

  describe("add_one", () => {
    it("should return the saved team with project and user relations", async () => {
      const project_id = randomUUID();
      const user_id = randomUUID();
      const team = { name: "test" } as Team;
      const project = { id: project_id } as Project;
      const user = { id: user_id } as User;

      const updates = {
        name: "test",
        project_ids: [project_id],
        user_ids: [user_id],
      } as CreateTeamDto;

      vi.mocked(project_repository.findBy).mockResolvedValue([project]);
      vi.mocked(user_repository.findBy).mockResolvedValue([user]);
      vi.mocked(team_repository.save).mockResolvedValue(team);

      expect(await service.add_one(updates)).toBe(team);

      expect(project_repository.findBy).toHaveBeenCalledWith({
        id: In([project_id]),
      });

      expect(user_repository.findBy).toHaveBeenCalledWith({
        id: In([user_id]),
      });

      expect(team_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test",
          projects: [project],
          users: [user],
        }),
      );
    });
  });

  describe("delete_one", () => {
    it("should return deleted team", async () => {
      const id = randomUUID();
      const team = { id } as Team;
      const deleted_team = { raw: null } as DeleteResult;

      vi.mocked(team_repository.findOne).mockResolvedValue(team);
      vi.mocked(team_repository.delete).mockResolvedValue(deleted_team);

      expect(await service.delete_one(id)).toBe(deleted_team);

      expect(team_repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      expect(team_repository.delete).toHaveBeenCalledWith(id);
    });

    it("should throw an error if team is not found", async () => {
      const id = randomUUID();

      vi.mocked(team_repository.findOne).mockResolvedValue(null);

      await expect(service.delete_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return all teams with projects and users", async () => {
      const teams = [{ id: randomUUID() }, { id: randomUUID() }] as Team[];

      vi.mocked(team_repository.find).mockResolvedValue(teams);

      expect(await service.get_all()).toBe(teams);

      expect(team_repository.find).toHaveBeenCalledWith({
        relations: { projects: true, users: true },
      });
    });
  });

  describe("get_one", () => {
    it("should return the matching team with projects and users", async () => {
      const id = randomUUID();
      const team = { id } as Team;

      vi.mocked(team_repository.findOne).mockResolvedValue(team);

      expect(await service.get_one(id)).toBe(team);

      expect(team_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { projects: true, users: true },
      });
    });

    it("should throw an error if team is not found", async () => {
      const id = randomUUID();

      vi.mocked(team_repository.findOne).mockResolvedValue(null);

      await expect(service.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should update the team and apply project and user relations", async () => {
      const id = randomUUID();
      const project_id = randomUUID();
      const user_id = randomUUID();
      const team = { id } as Team;
      const project = { id: project_id } as Project;
      const user = { id: user_id } as User;

      const updates = {
        name: "example",
        project_ids: [project_id],
        user_ids: [user_id],
      } as PatchTeamDto;

      const saved_team = { id } as Team;

      vi.mocked(team_repository.findOne).mockResolvedValue(team);
      vi.mocked(project_repository.findBy).mockResolvedValue([project]);
      vi.mocked(user_repository.findBy).mockResolvedValue([user]);
      vi.mocked(team_repository.save).mockResolvedValue(saved_team);

      expect(await service.patch_one(id, updates)).toBe(saved_team);

      expect(team_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { projects: true, users: true },
      });

      expect(project_repository.findBy).toHaveBeenCalledWith({
        id: In([project_id]),
      });

      expect(user_repository.findBy).toHaveBeenCalledWith({
        id: In([user_id]),
      });

      expect(team_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "example",
          projects: [project],
          users: [user],
        }),
      );
    });

    it("should throw an error if team is not found", async () => {
      const id = randomUUID();
      const updates = { name: "test" } as PatchTeamDto;

      vi.mocked(team_repository.findOne).mockResolvedValue(null);

      await expect(service.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
