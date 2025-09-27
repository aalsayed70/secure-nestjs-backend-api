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

  async searchByUsername(username: string): Promise<any[]> {
    let credentialsResults;
    let compolistResults;

    if (!username.trim()) {
      credentialsResults = await this.credentialsRepository
        .createQueryBuilder()
        .orderBy('RAND()')
        .limit(10)
        .getMany();

      compolistResults = await this.compolistRepository
        .createQueryBuilder()
        .orderBy('RAND()')
        .limit(10)
        .getMany();
    } else {
      credentialsResults = await this.credentialsRepository.find({
        where: { Username: Like(`%${username}%`) },
        take: 10,
      });

      compolistResults = await this.compolistRepository.find({
        where: { Username: Like(`%${username}%`) },
        take: 10,
      });
    }

    const combinedResults = [...credentialsResults, ...compolistResults].slice(0, 20);
    return combinedResults.map((entry) => ({
      Username: entry.Username,
      URL: entry.URL,
      Password: entry.Password,
    }));
  }
}

