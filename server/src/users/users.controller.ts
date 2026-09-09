import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { UsersService } from "src/users/users.service";

import { CreateUserDto, PatchUserDto } from "src/users/dto/user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @Post()
  async add_one(@Body() user: CreateUserDto) {
    return await this.users_service.add_one(user);
  }

  @Delete(":id")
  async remove_one(@Param("id") id: string) {
    return await this.users_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return await this.users_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: string) {
    return await this.users_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: string, @Body() updates: PatchUserDto) {
    return await this.users_service.patch_one(id, updates);
  }
}
