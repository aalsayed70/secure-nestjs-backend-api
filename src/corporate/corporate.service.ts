import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { SystemData } from '../entities/systemdata.entity';

@Injectable()
export class CorporateService {
  constructor(
    @InjectRepository(CredentialsData)
    private credentialsRepository: Repository<CredentialsData>,

    @InjectRepository(SystemData)
    private systemRepository: Repository<SystemData>,
  ) {}
  async searchCorporate(username: string): Promise<any[]> {
    let credentialResults;

    if (!username.trim()) {
      credentialResults = await this.credentialsRepository
        .createQueryBuilder()
        .orderBy('RAND()')
        .limit(15)
        .getMany();
    } else {
      credentialResults = await this.credentialsRepository.find({
        where: { Username: Like(`%${username}%`) },
        take: 15,
      });
    }
    const uniqueResults = new Map();
    for (const entry of credentialResults) {
      uniqueResults.set(entry.Username, entry);
    }
    const results: { credentials: CredentialsData; system: SystemData | null }[] = [];
    for (const entry of uniqueResults.values()) {
      const systemData = await this.systemRepository.findOne({ where: { HWID: entry.HWID } });

      results.push({
        credentials: entry, 
        system: systemData || null, 
      });
    }

    return results;
  }
}

