import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GithubSettingsDto } from './dto/github-settings.dto';
import { GithubRepos } from './github-repos.entity';
import { GithubReposService } from './github-repos.service';
import { GithubSettings } from './github-settings.entity';

@Controller('github-repos')
export class GithubReposController {
  constructor(private readonly githubReposService: GithubReposService) {}
  @Get()
  getReposBySearch(@Query('search') search: string): Promise<GithubRepos[]> {
    // get all repositories from the database
    // or get repositories by filter if search string provided
    if (search) {
      return this.githubReposService.getReposBySearch(search);
    } else {
      return this.githubReposService.getRepos();
    }
  }
  @Get('reset')
  async forceSync() {
    // force synchronization of database with the github API
    await this.githubReposService.forceSync();
    return;
  }

  @Get('settings')
  async getGithubSettings(): Promise<GithubSettings> {
    // get update settings from the database
    return await this.githubReposService.getSettings();
  }

  @Post('settings')
  async setGithubSettings(
    @Body() githubSettingsDto: GithubSettingsDto,
  ): Promise<GithubSettings> {
    // store update settings into the database
    return await this.githubReposService.setSettings(githubSettingsDto);
  }

  @Get(':id')
  getReposById(@Param('id') id: string): Promise<GithubRepos> {
    // get repository from the database by id
    return this.githubReposService.getReposById(id);
  }
}
