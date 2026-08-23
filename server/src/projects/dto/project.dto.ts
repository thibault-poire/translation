import { Transform } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
} from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(5, 5)
  default_language_tag: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  team_ids: number[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  key_ids: number[];
}

export class PatchProjectDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @Length(5, 5)
  default_language_tag: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  team_ids: number[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  key_ids: number[];
}
