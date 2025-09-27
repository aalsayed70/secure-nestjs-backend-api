import { Test, TestingModule } from '@nestjs/testing';
import { CombolistController } from './combolist.controller';
import { CombolistService } from './combolist.service';

describe('CombolistController', () => {
  let controller: CombolistController;
  let service: CombolistService;

  const mockCombolistService = {
    getPaginatedCombolist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CombolistController],
      providers: [
        {
          provide: CombolistService,
          useValue: mockCombolistService,
        },
      ],
    }).compile();

    controller = module.get<CombolistController>(CombolistController);
    service = module.get<CombolistService>(CombolistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCombolist', () => {
    it('should return paginated combolist results', async () => {
      const mockResults = [
        { Username: 'user1', URL: 'url1', Password: 'pass1' },
        { Username: 'user2', URL: 'url2', Password: 'pass2' },
      ];

      mockCombolistService.getPaginatedCombolist.mockResolvedValue(mockResults);

      const result = await controller.getCombolist({
        username: 'test',
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(mockResults);
      expect(mockCombolistService.getPaginatedCombolist).toHaveBeenCalledWith('test', 1, 10);
    });

    it('should use default values when parameters are not provided', async () => {
      const mockResults = [];

      mockCombolistService.getPaginatedCombolist.mockResolvedValue(mockResults);

      const result = await controller.getCombolist({});

      expect(result).toEqual(mockResults);
      expect(mockCombolistService.getPaginatedCombolist).toHaveBeenCalledWith('', 1, 20);
    });
  });
});
