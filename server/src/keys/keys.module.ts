import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { KeysController } from "src/keys/keys.controller";

import { KeysService } from "src/keys/keys.service";

import { Key } from "src/keys/entities/key.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Key, Project, Translation])],
  controllers: [KeysController],
  providers: [KeysService],
})
export class KeysModule {}
