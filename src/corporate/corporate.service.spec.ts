import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorporateService } from './corporate.service';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { SystemData } from '../entities/systemdata.entity';

describe('CorporateService', () => {
  let service: CorporateService;
  let credentialsRepository: Repository<CredentialsData>;
  let systemRepository: Repository<SystemData>;

  const mockCredentialsRepository = {
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
    find: jest.fn(),
  };

  const mockSystemRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorporateService,
        {
          provide: getRepositoryToken(CredentialsData),
          useValue: mockCredentialsRepository,
        },
        {
          provide: getRepositoryToken(SystemData),
          useValue: mockSystemRepository,
        },
      ],
    }).compile();

    service = module.get<CorporateService>(CorporateService);
    credentialsRepository = module.get<Repository<CredentialsData>>(getRepositoryToken(CredentialsData));
    systemRepository = module.get<Repository<SystemData>>(getRepositoryToken(SystemData));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchCorporate', () => {
    it('should return random results when username is empty', async () => {
      const mockCredentials = [
        { Username: 'user1', URL: 'url1', Password: 'pass1', HWID: 'hwid1' },
        { Username: 'user2', URL: 'url2', Password: 'pass2', HWID: 'hwid2' },
      ];

      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCredentials),
      };

      mockCredentialsRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockSystemRepository.findOne.mockResolvedValue({ HWID: 'hwid1', Country: 'US' });

      const result = await service.searchCorporate('');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('credentials');
      expect(result[0]).toHaveProperty('system');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('RAND()');
      expect(queryBuilder.limit).toHaveBeenCalledWith(15);
    });

    it('should return filtered results when username is provided', async () => {
      const mockCredentials = [
        { Username: 'testuser', URL: 'url1', Password: 'pass1', HWID: 'hwid1' },
      ];

      mockCredentialsRepository.find.mockResolvedValue(mockCredentials);
      mockSystemRepository.findOne.mockResolvedValue({ HWID: 'hwid1', Country: 'US' });

      const result = await service.searchCorporate('test');

      expect(result).toHaveLength(1);
      expect(mockCredentialsRepository.find).toHaveBeenCalledWith({
        where: { Username: expect.any(Object) },
        take: 15,
      });
    });

    it('should handle unique usernames correctly', async () => {
      const mockCredentials = [
        { Username: 'user1', URL: 'url1', Password: 'pass1', HWID: 'hwid1' },
        { Username: 'user1', URL: 'url2', Password: 'pass2', HWID: 'hwid2' }, // Duplicate username
        { Username: 'user2', URL: 'url3', Password: 'pass3', HWID: 'hwid3' },
      ];

      mockCredentialsRepository.find.mockResolvedValue(mockCredentials);
      mockSystemRepository.findOne.mockResolvedValue({ HWID: 'hwid1', Country: 'US' });

      const result = await service.searchCorporate('user');

      // Should only return unique usernames
      expect(result).toHaveLength(2);
      const usernames = result.map(r => r.credentials.Username);
      expect(usernames).toEqual(['user1', 'user2']);
    });

    it('should handle missing system data gracefully', async () => {
      const mockCredentials = [
        { Username: 'user1', URL: 'url1', Password: 'pass1', HWID: 'hwid1' },
      ];

      mockCredentialsRepository.find.mockResolvedValue(mockCredentials);
      mockSystemRepository.findOne.mockResolvedValue(null);

      const result = await service.searchCorporate('user');

      expect(result).toHaveLength(1);
      expect(result[0].system).toBeNull();
    });
  });
});
