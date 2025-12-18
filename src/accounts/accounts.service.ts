import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CredentialsData } from '../entities/credentialsdata.entity';
import { CompolistData } from '../entities/compolistdata.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(CredentialsData)
    private credentialsRepository: Repository<CredentialsData>,

    @InjectRepository(CompolistData)
    private compolistRepository: Repository<CompolistData>,
  ) {}

  async searchByUsername(username: string, page = 1, limit = 20): Promise<any[]> {
    const normalizedLimit = Math.min(Math.max(limit, 1), 100);
    const offset = (Math.max(page, 1) - 1) * normalizedLimit;

    const fetchRandom = !username.trim();

    const credentialsQuery = fetchRandom
      ? this.credentialsRepository
          .createQueryBuilder()
          .orderBy('RAND()')
          .offset(offset)
          .limit(normalizedLimit)
          .getMany()
      : this.credentialsRepository.find({
          where: { Username: Like(`%${username}%`) },
          skip: offset,
          take: normalizedLimit,
          order: { Username: 'ASC' },
        });

    const compolistQuery = fetchRandom
      ? this.compolistRepository
          .createQueryBuilder()
          .orderBy('RAND()')
          .offset(offset)
          .limit(normalizedLimit)
          .getMany()
      : this.compolistRepository.find({
          where: { Username: Like(`%${username}%`) },
          skip: offset,
          take: normalizedLimit,
          order: { Username: 'ASC' },
        });

    const [credentialsResults, compolistResults] = await Promise.all([credentialsQuery, compolistQuery]);

    const combinedResults = [...credentialsResults, ...compolistResults].slice(0, normalizedLimit);
    return combinedResults.map((entry) => ({
      Username: entry.Username,
      URL: entry.URL,
      Password: entry.Password,
    }));
  }
}
