import { Test, TestingModule } from '@nestjs/testing';
import { CorporateController } from './corporate.controller';
import { CorporateService } from './corporate.service';

describe('CorporateController', () => {
  let controller: CorporateController;
  let service: CorporateService;

  const mockCorporateService = {
    searchCorporate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateController],
      providers: [
        {
          provide: CorporateService,
          useValue: mockCorporateService,
        },
      ],
    }).compile();

    controller = module.get<CorporateController>(CorporateController);
    service = module.get<CorporateService>(CorporateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCorporateAccounts', () => {
    it('should return corporate search results', async () => {
      const mockResults = [
        {
          credentials: { Username: 'user1', URL: 'url1', Password: 'pass1', HWID: 'hwid1' },
          system: { HWID: 'hwid1', Country: 'US' },
        },
      ];

      mockCorporateService.searchCorporate.mockResolvedValue(mockResults);

      const result = await controller.getCorporateAccounts({ username: 'test' });

      expect(result).toEqual(mockResults);
      expect(mockCorporateService.searchCorporate).toHaveBeenCalledWith('test');
    });

    it('should handle empty username', async () => {
      const mockResults = [];
      mockCorporateService.searchCorporate.mockResolvedValue(mockResults);

      const result = await controller.getCorporateAccounts({});

      expect(result).toEqual(mockResults);
      expect(mockCorporateService.searchCorporate).toHaveBeenCalledWith('');
    });
  });
});
