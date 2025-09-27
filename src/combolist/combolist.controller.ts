import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { CombolistService } from './combolist.service';
import { PaginatedSearchDto } from '../common/dto/search.dto';

@Controller('combolist')
export class CombolistController {
  constructor(private readonly combolistService: CombolistService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getCombolist(@Query() searchDto: PaginatedSearchDto) {
    return await this.combolistService.getPaginatedCombolist(
      searchDto.username || '', 
      searchDto.page || 1, 
      searchDto.limit || 20
    );
  }
}