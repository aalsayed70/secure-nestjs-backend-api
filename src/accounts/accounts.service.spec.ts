import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsService } from './accounts.service';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { CompolistData } from '../entities/compolistdata.entity';

describe('AccountsService', () => {
  let service: AccountsService;
  let credentialsRepository: Repository<CredentialsData>;
  let compolistRepository: Repository<CompolistData>;

  const mockCredentialsRepository = {
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
    find: jest.fn(),
  };

  const mockCompolistRepository = {
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(CredentialsData),
          useValue: mockCredentialsRepository,
        },
        {
          provide: getRepositoryToken(CompolistData),
          useValue: mockCompolistRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    credentialsRepository = module.get<Repository<CredentialsData>>(getRepositoryToken(CredentialsData));
    compolistRepository = module.get<Repository<CompolistData>>(getRepositoryToken(CompolistData));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchByUsername', () => {
    it('should return random results when username is empty', async () => {
      const mockCredentials = [
        { Username: 'user1', URL: 'url1', Password: 'pass1' },
        { Username: 'user2', URL: 'url2', Password: 'pass2' },
      ];
      const mockCompolist = [
        { Username: 'user3', URL: 'url3', Password: 'pass3' },
      ];

      const credentialsQueryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCredentials),
      };

      const compolistQueryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCompolist),
      };

      mockCredentialsRepository.createQueryBuilder.mockReturnValue(credentialsQueryBuilder);
      mockCompolistRepository.createQueryBuilder.mockReturnValue(compolistQueryBuilder);

      const result = await service.searchByUsername('');

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ Username: 'user1', URL: 'url1', Password: 'pass1' });
      expect(credentialsQueryBuilder.orderBy).toHaveBeenCalledWith('RAND()');
      expect(credentialsQueryBuilder.limit).toHaveBeenCalledWith(20);
      expect(credentialsQueryBuilder.offset).toHaveBeenCalledWith(0);
    });

    it('should return filtered results when username is provided', async () => {
      const mockCredentials = [
        { Username: 'testuser', URL: 'url1', Password: 'pass1' },
      ];
      const mockCompolist = [
        { Username: 'testuser2', URL: 'url2', Password: 'pass2' },
      ];

      mockCredentialsRepository.find.mockResolvedValue(mockCredentials);
      mockCompolistRepository.find.mockResolvedValue(mockCompolist);

      const result = await service.searchByUsername('test');

      expect(result).toHaveLength(2);
      expect(mockCredentialsRepository.find).toHaveBeenCalledWith({
        where: { Username: expect.any(Object) },
        skip: 0,
        take: 20,
        order: { Username: 'ASC' },
      });
      expect(mockCompolistRepository.find).toHaveBeenCalledWith({
        where: { Username: expect.any(Object) },
        skip: 0,
        take: 20,
        order: { Username: 'ASC' },
      });
    });

    it('should limit results to 20 items maximum', async () => {
      const mockCredentials = Array(15).fill(null).map((_, i) => ({
        Username: `user${i}`, URL: `url${i}`, Password: `pass${i}`,
      }));
      const mockCompolist = Array(10).fill(null).map((_, i) => ({
        Username: `user${i + 15}`, URL: `url${i + 15}`, Password: `pass${i + 15}`,
      }));

      mockCredentialsRepository.find.mockResolvedValue(mockCredentials);
      mockCompolistRepository.find.mockResolvedValue(mockCompolist);

      const result = await service.searchByUsername('user');

      expect(result).toHaveLength(20);
    });

    it('should apply pagination offsets', async () => {
      const mockCredentials: any[] = [];
      const mockCompolist: any[] = [];

      mockCredentialsRepository.find.mockResolvedValue(mockCredentials);
      mockCompolistRepository.find.mockResolvedValue(mockCompolist);

      await service.searchByUsername('user', 2, 50);

      expect(mockCredentialsRepository.find).toHaveBeenCalledWith({
        where: { Username: expect.any(Object) },
        skip: 50,
        take: 50,
        order: { Username: 'ASC' },
      });
      expect(mockCompolistRepository.find).toHaveBeenCalledWith({
        where: { Username: expect.any(Object) },
        skip: 50,
        take: 50,
        order: { Username: 'ASC' },
      });
    });
  });
});
