import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  const mockAccountsService = {
    searchByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSimilarAccounts', () => {
    it('should return search results', async () => {
      const mockResults = [
        { Username: 'user1', URL: 'url1', Password: 'pass1' },
        { Username: 'user2', URL: 'url2', Password: 'pass2' },
      ];

      mockAccountsService.searchByUsername.mockResolvedValue(mockResults);

      const result = await controller.getSimilarAccounts({ username: 'test' });

      expect(result).toEqual(mockResults);
      expect(mockAccountsService.searchByUsername).toHaveBeenCalledWith('test');
    });

    it('should handle empty username', async () => {
      const mockResults = [];
      mockAccountsService.searchByUsername.mockResolvedValue(mockResults);

      const result = await controller.getSimilarAccounts({});

      expect(result).toEqual(mockResults);
      expect(mockAccountsService.searchByUsername).toHaveBeenCalledWith('');
    });
  });
});
