import { IsArray, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateKeyDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsUUID()
  project_id: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  translation_ids: string[];
}

export class PatchKeyDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsUUID()
  project_id: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  translation_ids: string[];
}
