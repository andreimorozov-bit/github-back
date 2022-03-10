import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubSettingsRepository } from 'src/github-repos/github-settings.repository';
import { GithubReposController } from './github-repos.controller';
import { GithubReposRepository } from './github-repos.repository';
import { GithubReposService } from './github-repos.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([GithubReposRepository, GithubSettingsRepository]),
  ],
  controllers: [GithubReposController],
  providers: [GithubReposService],
})
export class GithubReposModule {}
