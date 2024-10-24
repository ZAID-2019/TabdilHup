import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, CountriesModule, CitiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
