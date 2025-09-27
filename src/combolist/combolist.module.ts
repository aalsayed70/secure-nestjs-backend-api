import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombolistService } from './combolist.service';
import { CombolistController } from './combolist.controller';
import { CompolistData } from '../entities/compolistdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompolistData])],
  controllers: [CombolistController],
  providers: [CombolistService],
})
export class CombolistModule {}

