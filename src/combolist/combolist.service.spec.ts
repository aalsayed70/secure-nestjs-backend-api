import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CombolistService } from './combolist.service';
import { CompolistData } from '../entities/compolistdata.entity';

describe('CombolistService', () => {
  let service: CombolistService;
  let compolistRepository: Repository<CompolistData>;

  const mockCompolistRepository = {
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CombolistService,
        {
          provide: getRepositoryToken(CompolistData),
          useValue: mockCompolistRepository,
        },
      ],
    }).compile();

    service = module.get<CombolistService>(CombolistService);
    compolistRepository = module.get<Repository<CompolistData>>(getRepositoryToken(CompolistData));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchCombolist', () => {
    it('should return random results when username is empty', async () => {
      const mockData = [
        { Username: 'user1', URL: 'url1', Password: 'pass1' },
        { Username: 'user2', URL: 'url2', Password: 'pass2' },
      ];

      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockCompolistRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.searchCombolist('', 1, 20);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ Username: 'user1', URL: 'url1', Password: 'pass1' });
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('RAND()');
      expect(queryBuilder.limit).toHaveBeenCalledWith(20);
    });

    it('should return filtered results when username is provided', async () => {
      const mockData = [
        { Username: 'testuser', URL: 'url1', Password: 'pass1' },
      ];

      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockCompolistRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.searchCombolist('test', 1, 20);

      expect(result).toHaveLength(1);
      expect(queryBuilder.where).toHaveBeenCalled();
    });

    it('should handle unique usernames correctly', async () => {
      const mockData = [
        { Username: 'user1', URL: 'url1', Password: 'pass1' },
        { Username: 'user1', URL: 'url2', Password: 'pass2' }, // Duplicate username
        { Username: 'user2', URL: 'url3', Password: 'pass3' },
      ];

      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockCompolistRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.searchCombolist('', 1, 20);

      // Should only return unique usernames
      expect(result).toHaveLength(2);
      const usernames = result.map(r => r.Username);
      expect(usernames).toEqual(['user1', 'user2']);
    });
  });

  describe('getPaginatedCombolist', () => {
    it('should return paginated results when username is empty', async () => {
      const mockData = [
        { Username: 'user1', URL: 'url1', Password: 'pass1' },
        { Username: 'user2', URL: 'url2', Password: 'pass2' },
      ];

      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockCompolistRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getPaginatedCombolist('', 2, 10);

      expect(result).toHaveLength(2);
      expect(queryBuilder.limit).toHaveBeenCalledWith(10);
      expect(queryBuilder.offset).toHaveBeenCalledWith(10); // (page - 1) * limit
    });

    it('should return filtered paginated results when username is provided', async () => {
      const mockData = [
        { Username: 'testuser', URL: 'url1', Password: 'pass1' },
      ];

      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockCompolistRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getPaginatedCombolist('test', 1, 5);

      expect(result).toHaveLength(1);
      expect(queryBuilder.where).toHaveBeenCalled();
      expect(queryBuilder.limit).toHaveBeenCalledWith(5);
      expect(queryBuilder.offset).toHaveBeenCalledWith(0);
    });
  });
});
