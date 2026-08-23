import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Team])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
