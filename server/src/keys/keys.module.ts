import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Key } from "src/keys/entities/key.entity";
import { KeysController } from "src/keys/keys.controller";
import { KeysService } from "src/keys/keys.service";

@Module({
  imports: [TypeOrmModule.forFeature([Key])],
  controllers: [KeysController],
  providers: [KeysService],
})
export class KeysModule {}
