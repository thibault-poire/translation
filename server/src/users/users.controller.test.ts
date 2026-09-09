import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { UsersController } from "src/users/users.controller";

import { UsersService } from "src/users/users.service";

import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

import { CreateUserDto, PatchUserDto } from "src/users/dto/user.dto";

import type { DeleteResult, Repository } from "typeorm";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService({} as Repository<User>, {} as Repository<Team>);

    controller = new UsersController(service);
  });

  describe("add_one", () => {
    it("should return the created user", async () => {
      const dto = {
        first_name: "John",
        last_name: "Doe",
      } as CreateUserDto;

      const id = randomUUID();
      const new_user = { id, first_name: "John", last_name: "Doe" } as User;

      vi.spyOn(service, "add_one").mockResolvedValue(new_user);

      expect(await controller.add_one(dto)).toBe(new_user);
    });
  });

  describe("remove_one", () => {
    it("should return the correct deleted user depending on id", async () => {
      const id = randomUUID();
      const deleted_user = { raw: null } as DeleteResult;

      vi.spyOn(service, "delete_one").mockResolvedValue(deleted_user);

      expect(await controller.remove_one(id)).toBe(deleted_user);
    });

    it("should throw an error if the user is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.remove_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return an array of users", async () => {
      const users = Array.apply({ length: 5 }).map(() => ({ id: randomUUID() }) as User);

      vi.spyOn(service, "get_all").mockResolvedValue(users);

      expect(await controller.get_all()).toBe(users);
    });
  });

  describe("get_one", () => {
    it("should return the correct user depending on id", async () => {
      const id = randomUUID();
      const user = { id } as User;

      vi.spyOn(service, "get_one").mockResolvedValue(user);

      expect(await controller.get_one(id)).toBe(user);
    });

    it("should throw an error if the user is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the updated user", async () => {
      const id = randomUUID();
      const updates = { first_name: "Jane" } as PatchUserDto;
      const updated_user = { id, first_name: "Jane" } as User;

      vi.spyOn(service, "patch_one").mockResolvedValue(updated_user);

      expect(await controller.patch_one(id, updates)).toBe(updated_user);
    });

    it("should throw an error if the user is not found", async () => {
      const id = randomUUID();
      const updates = { first_name: "Jane" } as PatchUserDto;

      vi.spyOn(service, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(controller.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
