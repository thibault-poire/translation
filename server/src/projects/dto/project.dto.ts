import { IsArray, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID()
  default_language_id: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  team_ids: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  key_ids: string[];
}

export class PatchProjectDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID("4", { each: true })
  default_language_id: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  team_ids: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  key_ids: string[];
}
