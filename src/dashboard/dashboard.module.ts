import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SystemData } from '../entities/systemdata.entity';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { CompolistData } from '../entities/compolistdata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemData, CredentialsData, CompolistData]) // ✅ Import repositories
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

