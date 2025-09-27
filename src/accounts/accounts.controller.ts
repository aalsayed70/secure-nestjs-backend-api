import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { SearchDto } from '../common/dto/search.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getSimilarAccounts(@Query() searchDto: SearchDto) {
    return await this.accountsService.searchByUsername(searchDto.username || '');
  }
}

