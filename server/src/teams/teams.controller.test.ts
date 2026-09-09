import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { TeamsController } from "src/teams/teams.controller";

import { TeamsService } from "src/teams/teams.service";

import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

import { CreateTeamDto, PatchTeamDto } from "src/teams/dto/team.dto";

import type { DeleteResult, Repository } from "typeorm";

describe("TeamsController", () => {
  let controller: TeamsController;
  let service: TeamsService;

  beforeEach(() => {
    service = new TeamsService(
      {} as Repository<Team>,
      {} as Repository<Project>,
      {} as Repository<User>,
    );

    controller = new TeamsController(service);
  });

  describe("add_one", () => {
    it("should return the created team", async () => {
      const dto = {
        name: "test",
      } as CreateTeamDto;

      const id = randomUUID();
      const new_team = { id } as Team;

      vi.spyOn(service, "add_one").mockResolvedValue(new_team);

      expect(await controller.add_one(dto)).toBe(new_team);
    });
  });

  describe("delete_one", () => {
    it("should return the correct deleted team depending on id", async () => {
      const id = randomUUID();
      const deleted_team = { raw: null } as DeleteResult;

      vi.spyOn(service, "delete_one").mockResolvedValue(deleted_team);

      expect(await controller.remove_one(id)).toBe(deleted_team);
    });

    it("should throw an error if the team is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.remove_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return an array of teams", async () => {
      const teams = Array.apply({ length: 5 }).map(() => ({ id: randomUUID() }) as Team);

      vi.spyOn(service, "get_all").mockResolvedValue(teams);

      expect(await controller.get_all()).toBe(teams);
    });
  });

  describe("get_one", () => {
    it("should return the correct team depending on id", async () => {
      const id = randomUUID();
      const team = { id } as Team;

      vi.spyOn(service, "get_one").mockResolvedValue(team);

      expect(await controller.get_one(id)).toBe(team);
    });

    it("should throw an error if the team is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the correct updated team depending on id", async () => {
      const id = randomUUID();
      const team = { id } as Team;
      const to_update_team = {} as PatchTeamDto;

      vi.spyOn(service, "patch_one").mockResolvedValue(team);

      expect(await controller.patch_one(id, to_update_team)).toBe(team);
    });

    it("should throw an error if the team is not found", async () => {
      const id = randomUUID();
      const to_update_team = {} as PatchTeamDto;

      vi.spyOn(service, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(controller.patch_one(id, to_update_team)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
