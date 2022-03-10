import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GithubSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  updateIntervalMinutes: number;
}
