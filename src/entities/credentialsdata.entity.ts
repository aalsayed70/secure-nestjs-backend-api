import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { SystemData } from "./systemdata.entity";

@Entity()
export class CredentialsData {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: "text" }) // Matches TEXT in MySQL
  Software: string;

  @Column({ type: "text" }) // Matches TEXT in MySQL
  URL: string;

  @Column({ type: "text" }) // Matches TEXT in MySQL
  Username: string;

  @Column({ type: "text" }) // Matches TEXT in MySQL
  Password: string;

  @ManyToOne(() => SystemData, (systemData) => systemData.HWID, { onDelete: "CASCADE" })  
  @JoinColumn({ name: "HWID", referencedColumnName: "HWID" }) // Ensures the correct foreign key mapping
  systemData: SystemData; // Foreign key reference

  @Column({ type: "timestamp", nullable: true }) // Matches TIMESTAMP
  LeakedDate: Date;
}
