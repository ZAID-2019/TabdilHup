import { Module } from '@nestjs/common'; // Import necessary decorators
import { PrismaService } from './prisma.service'; // Import PrismaService

@Module({
  providers: [PrismaService], // Register PrismaService as a provider
  exports: [PrismaService], // Export PrismaService for use in other modules
})
export class PrismaModule {}