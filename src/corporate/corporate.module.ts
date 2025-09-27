import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateService } from './corporate.service';
import { CorporateController } from './corporate.controller';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { SystemData } from '../entities/systemdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialsData, SystemData])],
  controllers: [CorporateController],
  providers: [CorporateService],
})
export class CorporateModule {}

