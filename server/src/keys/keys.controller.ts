import { Controller } from "@nestjs/common";

import { KeysService } from "src/keys/keys.service";

@Controller("keys")
export class KeysController {
  constructor(private readonly keys_service: KeysService) {}
}
