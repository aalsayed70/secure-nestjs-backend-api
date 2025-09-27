import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardService } from './dashboard.service';
import { SystemData } from '../entities/systemdata.entity';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { CompolistData } from '../entities/compolistdata.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let systemRepository: Repository<SystemData>;
  let credentialsRepository: Repository<CredentialsData>;
  let compolistRepository: Repository<CompolistData>;

  const mockSystemRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  };

  const mockCredentialsRepository = {
    count: jest.fn(),
  };

  const mockCompolistRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(SystemData),
          useValue: mockSystemRepository,
        },
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

    service = module.get<DashboardService>(DashboardService);
    systemRepository = module.get<Repository<SystemData>>(getRepositoryToken(SystemData));
    credentialsRepository = module.get<Repository<CredentialsData>>(getRepositoryToken(CredentialsData));
    compolistRepository = module.get<Repository<CompolistData>>(getRepositoryToken(CompolistData));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeviceCount', () => {
    it('should return device count', async () => {
      const expectedCount = 10;
      mockSystemRepository.count.mockResolvedValue(expectedCount);

      const result = await service.getDeviceCount();

      expect(result).toBe(expectedCount);
      expect(mockSystemRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAccountCount', () => {
    it('should return combined account count', async () => {
      const credentialsCount = 5;
      const compolistCount = 3;
      const expectedTotal = 8;

      mockCredentialsRepository.count.mockResolvedValue(credentialsCount);
      mockCompolistRepository.count.mockResolvedValue(compolistCount);

      const result = await service.getAccountCount();

      expect(result).toBe(expectedTotal);
      expect(mockCredentialsRepository.count).toHaveBeenCalledTimes(1);
      expect(mockCompolistRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCorporateCount', () => {
    it('should return corporate count', async () => {
      const expectedCount = 7;
      mockCredentialsRepository.count.mockResolvedValue(expectedCount);

      const result = await service.getCorporateCount();

      expect(result).toBe(expectedCount);
      expect(mockCredentialsRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCountryFrequency', () => {
    it('should return country frequency data', async () => {
      const mockCountryData = [
        { country: 'US', count: '5' },
        { country: 'UK', count: '3' },
        { country: 'CA', count: '2' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockCountryData),
      };

      mockSystemRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getCountryFrequency();

      expect(result).toEqual({
        countries: { US: 5, UK: 3, CA: 2 },
        total: 10,
      });
      expect(queryBuilder.select).toHaveBeenCalledWith('system.Country', 'country');
      expect(queryBuilder.addSelect).toHaveBeenCalledWith('COUNT(*)', 'count');
      expect(queryBuilder.groupBy).toHaveBeenCalledWith('system.Country');
    });
  });

  describe('getDashboardStats', () => {
    it('should return complete dashboard statistics', async () => {
      const mockStats = {
        devices: 10,
        accounts: 8,
        corporate: 7,
        country_frequency: { US: 5, UK: 3 },
        total_countries: 8,
      };

      jest.spyOn(service, 'getDeviceCount').mockResolvedValue(mockStats.devices);
      jest.spyOn(service, 'getAccountCount').mockResolvedValue(mockStats.accounts);
      jest.spyOn(service, 'getCorporateCount').mockResolvedValue(mockStats.corporate);
      jest.spyOn(service, 'getCountryFrequency').mockResolvedValue({
        countries: mockStats.country_frequency,
        total: mockStats.total_countries,
      });

      const result = await service.getDashboardStats();

      expect(result).toEqual(mockStats);
    });
  });
});
