import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { SearchDto } from '../common/dto/search.dto';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getCorporateAccounts(@Query() searchDto: SearchDto) {
    return await this.corporateService.searchCorporate(searchDto.username || '');
  }
}

