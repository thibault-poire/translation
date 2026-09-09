import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from "src/users/users.controller";

import { UsersService } from "src/users/users.service";

import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Team])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
