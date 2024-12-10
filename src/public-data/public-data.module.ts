import { Module } from '@nestjs/common';
import { PublicDataService } from './public-data.service';
import { PublicDataController } from './public-data.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [PublicDataService],
  controllers: [PublicDataController]
})
export class PublicDataModule {}
