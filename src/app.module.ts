import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, CountriesModule, CitiesModule, ItemsModule, CategoriesModule, SubscriptionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
