import { randomUUID } from "crypto";
import { In } from "typeorm";

import { NotFoundException } from "@nestjs/common";

import { UsersService } from "src/users/users.service";

import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

import { CreateUserDto, PatchUserDto } from "src/users/dto/user.dto";

import type { DeleteResult, ObjectLiteral, Repository } from "typeorm";

describe("UsersService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
    }) as unknown as Repository<T>;

  let service: UsersService;
  let user_repository: Repository<User>;
  let team_repository: Repository<Team>;

  beforeEach(() => {
    user_repository = repository_mock<User>();
    team_repository = repository_mock<Team>();

    service = new UsersService(user_repository, team_repository);
  });

  describe("add_one", () => {
    it("should return the saved user with team relations", async () => {
      const team_id = randomUUID();
      const team = { id: team_id } as Team;
      const user = { first_name: "John", last_name: "Doe" } as User;

      const updates = {
        first_name: "John",
        last_name: "Doe",
        team_ids: [team_id],
      } as CreateUserDto;

      vi.mocked(team_repository.findBy).mockResolvedValue([team]);
      vi.mocked(user_repository.save).mockResolvedValue(user);

      expect(await service.add_one(updates)).toBe(user);

      expect(team_repository.findBy).toHaveBeenCalledWith({
        id: In([team_id]),
      });

      expect(user_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ first_name: "John", last_name: "Doe", teams: [team] }),
      );
    });
  });

  describe("delete_one", () => {
    it("should return deleted user", async () => {
      const id = randomUUID();
      const deleted_user = { raw: null } as DeleteResult;

      vi.mocked(user_repository.delete).mockResolvedValue(deleted_user);

      expect(await service.delete_one(id)).toBe(deleted_user);

      expect(user_repository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe("get_all", () => {
    it("should return all users with teams", async () => {
      const users = [{ id: randomUUID() }, { id: randomUUID() }] as User[];

      vi.mocked(user_repository.find).mockResolvedValue(users);

      expect(await service.get_all()).toBe(users);

      expect(user_repository.find).toHaveBeenCalledWith({
        relations: { teams: true },
      });
    });
  });

  describe("get_one", () => {
    it("should return the matching user with teams", async () => {
      const id = randomUUID();
      const user = { id } as User;

      vi.mocked(user_repository.findOne).mockResolvedValue(user);

      expect(await service.get_one(id)).toBe(user);

      expect(user_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { teams: true },
      });
    });

    it("should throw an error if user is not found", async () => {
      const id = randomUUID();

      vi.mocked(user_repository.findOne).mockResolvedValue(null);

      await expect(service.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should update the user and apply team relations", async () => {
      const id = randomUUID();
      const team_id = randomUUID();
      const user = { id } as User;
      const team = { id: team_id } as Team;

      const updates = {
        first_name: "Jane",
        team_ids: [team_id],
      } as PatchUserDto;

      const saved_user = { id } as User;

      vi.mocked(user_repository.findOne).mockResolvedValue(user);
      vi.mocked(team_repository.findBy).mockResolvedValue([team]);
      vi.mocked(user_repository.save).mockResolvedValue(saved_user);

      expect(await service.patch_one(id, updates)).toBe(saved_user);

      expect(user_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { teams: true },
      });

      expect(team_repository.findBy).toHaveBeenCalledWith({
        id: In([team_id]),
      });

      expect(user_repository.save).toHaveBeenCalled();
    });

    it("should throw an error if user is not found", async () => {
      const id = randomUUID();
      const updates = { first_name: "Jane" } as PatchUserDto;

      vi.mocked(user_repository.findOne).mockResolvedValue(null);

      await expect(service.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
