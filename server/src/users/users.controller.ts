import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateUserDto, type PatchUserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @Post()
  async add_one(@Body() user: CreateUserDto) {
    return this.users_service.add_one(user);
  }

  @Delete()
  async remove_one(@Param("id") id: number) {
    return this.users_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return this.users_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: number) {
    return this.users_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: number, @Body() updates: PatchUserDto) {
    return this.users_service.patch_one(id, updates);
  }
}
