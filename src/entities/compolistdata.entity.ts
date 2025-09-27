import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['url_md5', 'username_md5'])  // Matches MySQL UNIQUE constraint
export class CompolistData {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'text', nullable: false })  // Matches TEXT NOT NULL
  URL: string;

  @Column({ type: 'text', nullable: false })  // Matches TEXT NOT NULL
  Username: string;

  @Column({ type: 'text', nullable: true })  // Matches TEXT
  Password: string;

  @Column({ type: 'varchar', length: 32, generatedType: 'STORED', asExpression: 'MD5(URL)' })  // Matches GENERATED COLUMN
  url_md5: string;

  @Column({ type: 'varchar', length: 32, generatedType: 'STORED', asExpression: 'MD5(Username)' })  // Matches GENERATED COLUMN
  username_md5: string;
}
