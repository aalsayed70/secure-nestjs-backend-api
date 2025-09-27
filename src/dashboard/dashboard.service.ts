
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemData } from '../entities/systemdata.entity';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { CompolistData } from '../entities/compolistdata.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SystemData)
    private systemRepository: Repository<SystemData>,

    @InjectRepository(CredentialsData)
    private credentialsRepository: Repository<CredentialsData>,

    @InjectRepository(CompolistData)
    private compolistRepository: Repository<CompolistData>,
  ) {}
  async getDeviceCount(): Promise<number> {
    return this.systemRepository.count();
  }
  async getAccountCount(): Promise<number> {
    const credentialsCount = await this.credentialsRepository.count();
    const compolistCount = await this.compolistRepository.count();
    return credentialsCount + compolistCount;
  }
  async getCorporateCount(): Promise<number> {
    return this.credentialsRepository.count();
  }
  async getCountryFrequency(): Promise<{ countries: Record<string, number>; total: number }> {
    const countryCounts = await this.systemRepository
      .createQueryBuilder('system')
      .select('system.Country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('system.Country')
      .getRawMany();
    const result = {};
    let total = 0;
    for (const row of countryCounts) {
      result[row.country] = Number(row.count);
      total += Number(row.count);
    }

    return { countries: result, total };
  }

  async getDashboardStats() {
    const [devices, accounts, corporate, countryData] = await Promise.all([
      this.getDeviceCount(),
      this.getAccountCount(),
      this.getCorporateCount(),
      this.getCountryFrequency(),
    ]);

    return {
      devices,
      accounts,
      corporate,
      country_frequency: countryData.countries,
      total_countries: countryData.total,
    };
  }
}
