
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemData } from './entities/systemdata.entity';
import { CredentialsData } from './entities/credentialsdata.entity';
import { CompolistData } from './entities/compolistdata.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountsModule } from './accounts/accounts.module';
import { CorporateModule } from './corporate/corporate.module';
import { CombolistModule } from './combolist/combolist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || '**',
      password: process.env.DB_PASSWORD || '**',
      database: process.env.DB_DATABASE || '**',
      entities: [SystemData, CredentialsData, CompolistData],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([SystemData, CredentialsData, CompolistData]),
    DashboardModule,
    AccountsModule,
    CorporateModule,
    CombolistModule,
  ],
})
export class AppModule {}

