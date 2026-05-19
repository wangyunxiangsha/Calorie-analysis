import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModesService {
  constructor(private readonly prisma: PrismaService) {}

  listModes() {
    return this.prisma.modeConfig.findMany({
      orderBy: { healthMode: 'asc' },
    });
  }

  getConfig(healthMode: string) {
    return this.prisma.modeConfig.findUniqueOrThrow({
      where: { healthMode: healthMode as never },
    });
  }
}
