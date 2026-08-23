import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Language } from "src/languages/entities/language.entity";

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly language_repository: Repository<Language>,
  ) {}

  async get_all(): Promise<Language[]> {
    return this.language_repository.find();
  }
}
