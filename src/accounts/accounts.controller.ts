import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PaginatedSearchDto } from '../common/dto/search.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getSimilarAccounts(@Query() searchDto: PaginatedSearchDto) {
    return await this.accountsService.searchByUsername(
      searchDto.username || '',
      searchDto.page || 1,
      searchDto.limit || 20,
    );
  }
}
