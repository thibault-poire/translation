import { IsArray, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  project_ids: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  user_ids: string[];
}

export class PatchTeamDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  project_ids: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  user_ids: string[];
}
