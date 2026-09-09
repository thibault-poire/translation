import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LanguagesController } from "src/languages/languages.controller";

import { LanguagesService } from "src/languages/languages.service";

import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Language, Project, Translation])],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class LanguagesModule {}
