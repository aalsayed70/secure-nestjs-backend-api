import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { CompolistData } from '../entities/compolistdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialsData, CompolistData])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}

