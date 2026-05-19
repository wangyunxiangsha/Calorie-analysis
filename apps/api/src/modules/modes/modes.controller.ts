import { Controller, Get } from '@nestjs/common';
import { ModesService } from './modes.service';

@Controller('modes')
export class ModesController {
  constructor(private readonly modes: ModesService) {}

  @Get()
  list() {
    return this.modes.listModes();
  }
}
