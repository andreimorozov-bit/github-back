import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GithubSettingsDto } from './dto/github-settings.dto';
import { GithubRepos } from './github-repos.entity';
import { GithubReposService } from './github-repos.service';
import { GithubSettings } from './github-settings.entity';

@Controller('github-repos')
export class GithubReposController {
  constructor(private readonly githubReposService: GithubReposService) {}
  // @Get()
  // getRepos(): Promise<GithubRepos[]> {
  //   return this.githubReposService.getRepos();
  // }

  @Get()
  getReposBySearch(@Query('search') search: string): Promise<GithubRepos[]> {
    if (search) {
      return this.githubReposService.getReposBySearch(search);
    } else {
      return this.githubReposService.getRepos();
    }
  }

  @Post()
  async updateRepos(): Promise<void> {
    await this.githubReposService.updateRepos();
    return;
  }

  @Delete()
  async deleteAllRepos(): Promise<void> {
    await this.githubReposService.deleteAllRepos();
    return;
  }

  @Get('reset')
  async forceSync() {
    await this.githubReposService.forceSync();
    return;
  }

  @Get('settings')
  async getGithubSettings(): Promise<GithubSettings> {
    return await this.githubReposService.getSettings();
  }

  @Post('settings')
  async setGithubSettings(
    @Body() githubSettingsDto: GithubSettingsDto,
  ): Promise<GithubSettings> {
    return await this.githubReposService.setSettings(githubSettingsDto);
  }

  @Get(':id')
  getReposById(@Param('id') id: string): Promise<GithubRepos> {
    return this.githubReposService.getReposById(id);
  }
}
