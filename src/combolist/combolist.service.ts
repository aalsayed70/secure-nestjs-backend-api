import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsUtils } from 'typeorm';
import { CompolistData } from '../entities/compolistdata.entity';

@Injectable()
export class CombolistService {
  constructor(
    @InjectRepository(CompolistData)
    private compolistRepository: Repository<CompolistData>,
  ) {}

  async searchCombolist(username: string, page = 1, limit = 20): Promise<any[]> {
    let queryBuilder = this.compolistRepository
      .createQueryBuilder('c')
      .orderBy('RAND()');

    let compolistResults;
    if (!username.trim()) {
      // Randomly order and limit the results
      compolistResults = await queryBuilder.limit(limit).getMany();
    } else {
      // Filter by username and limit the results
      const whereConditions = { Username: Like(`%${username}%`) };
      queryBuilder.where(whereConditions);
      compolistResults = await queryBuilder.getMany();
    }

    const uniqueResults = new Map();
    for (const entry of compolistResults) {
      uniqueResults.set(entry.Username, entry);
    }
    return Array.from(uniqueResults.values()).map((entry) => ({
      Username: entry.Username,
      URL: entry.URL,
      Password: entry.Password,
    }));
  }

  async getPaginatedCombolist(username: string, page = 1, limit = 20): Promise<any[]> {
    let queryBuilder = this.compolistRepository
      .createQueryBuilder('c')
      .orderBy('RAND()');

    let compolistResults;
    if (!username.trim()) {
      // Randomly order and limit the results with pagination
      compolistResults = await queryBuilder.limit(limit).offset((page - 1) * limit).getMany();
    } else {
      // Filter by username and limit the results with pagination
      const whereConditions = { Username: Like(`%${username}%`) };
      queryBuilder.where(whereConditions);
      compolistResults = await queryBuilder.limit(limit).offset((page - 1) * limit).getMany();
    }

    const uniqueResults = new Map();
    for (const entry of compolistResults) {
      uniqueResults.set(entry.Username, entry);
    }
    return Array.from(uniqueResults.values()).map((entry) => ({
      Username: entry.Username,
      URL: entry.URL,
      Password: entry.Password,
    }));
  }
}