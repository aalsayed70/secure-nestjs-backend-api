import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['HWID'])  // Ensures HWID is unique
export class SystemData {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'text' })  // Matches TEXT in MySQL
  OS: string;

  @Column({ type: 'text' })  // Matches TEXT in MySQL
  Path: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })  // Matches TIMESTAMP
  InstallDate: Date;

  @Column({ type: 'text' })  // Matches TEXT in MySQL
  Hostname: string;

  @Column({ type: 'text', nullable: true })  // Changed from JSON to TEXT
  Antivirus: string;

  @Column({ type: 'varchar', length: 255, unique: true })  // Matches VARCHAR(255)
  HWID: string;

  @Column({ type: 'text' })  // Matches TEXT in MySQL
  IPAddress: string;

  @Column({ type: 'timestamp', nullable: true })  // Matches TIMESTAMP
  LeakedDate: Date;

  @Column({ type: 'text' })  // Matches TEXT in MySQL
  Country: string;
}
