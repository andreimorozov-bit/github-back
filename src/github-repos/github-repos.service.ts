import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, ILike } from 'typeorm';
import { GithubReposRepository } from './github-repos.repository';
import { GithubRepos } from './github-repos.entity';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { GithubSettingsRepository } from './github-settings.repository';
import { GithubSettings } from './github-settings.entity';
import { GithubSettingsDto } from './dto/github-settings.dto';

@Injectable()
export class GithubReposService implements OnModuleInit {
  private settings = {
    numberOfItems: 25,
    updateInterval: 60,
    theInterval: null,
  };
  constructor(
    @InjectRepository(GithubReposRepository)
    private githubReposRepository: GithubReposRepository,
    @InjectRepository(GithubSettingsRepository)
    private githubSettingsRepository: GithubSettingsRepository,
    private httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.syncGithub();
    this.startUpdateInterval();
  }

  async startUpdateInterval() {
    await this.checkUpdateInterval();
    this.settings.theInterval = setInterval(async () => {
      await this.syncGithub();
    }, this.settings.updateInterval * 1000 * 60);
  }

  stopUpdateInterval() {
    clearInterval(this.settings.theInterval);
  }

  async checkUpdateInterval() {
    const query =
      this.githubSettingsRepository.createQueryBuilder('github_settings');
    const githubSettings = await query.getOne();
    if (
      githubSettings &&
      githubSettings.updateIntervalMinutes &&
      githubSettings.updateIntervalMinutes > 0
    ) {
      this.settings.updateInterval = githubSettings.updateIntervalMinutes;
    }
  }

  async syncGithub() {
    await this.deleteAllRepos();
    await this.updateRepos();
  }

  async getRepos(): Promise<GithubRepos[]> {
    const query = this.githubReposRepository.createQueryBuilder('github_repos');
    query.orderBy('github_repos.stargazers_count', 'DESC');
    const githubRepos = await query.getMany();
    return githubRepos;
  }

  async getReposById(id: string): Promise<GithubRepos> {
    const query = this.githubReposRepository.createQueryBuilder('github_repos');
    query.where({ id });
    const githubRepos = await query.getOne();
    return githubRepos;
  }

  async getReposBySearch(search: string): Promise<GithubRepos[]> {
    const query = this.githubReposRepository.createQueryBuilder('github_repos');
    query.where({ name: ILike(`%${search}%`) });
    query.orWhere({ id: ILike(`%${search}%`) });
    query.orderBy('github_repos.stargazers_count', 'DESC');
    const githubRepos = await query.getMany();
    return githubRepos;
  }

  async updateRepos(): Promise<AxiosResponse<unknown>> {
    const response = this.httpService.get(
      'https://api.github.com/search/repositories',
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
        params: {
          q: 'stars:>=50000',
          sort: 'stars',
          order: 'desc',
          per_page: this.settings.numberOfItems,
        },
      },
    );
    response.subscribe(async (res) => {
      const newRepo = res.data['items'];
      const repos = this.githubReposRepository.create(newRepo);
      await this.githubReposRepository.save(repos);
    });

    return firstValueFrom(response);
  }

  async getSettings(): Promise<GithubSettings> {
    const query =
      this.githubSettingsRepository.createQueryBuilder('github_settings');
    return await query.getOne();
  }

  async setSettings(
    githubSettings: GithubSettingsDto,
  ): Promise<GithubSettings> {
    const settings = await this.githubSettingsRepository.findOne();
    let newSettings: GithubSettings;
    if (settings && settings.updateIntervalMinutes) {
      settings.updateIntervalMinutes = githubSettings.updateIntervalMinutes;
      newSettings = await this.githubSettingsRepository.save(settings);
    } else {
      newSettings = this.githubSettingsRepository.create(githubSettings);
      newSettings = await this.githubSettingsRepository.save(newSettings);
    }
    await this.forceSync();
    return newSettings;
  }

  async forceSync(): Promise<void> {
    this.stopUpdateInterval();
    await this.syncGithub();
    this.startUpdateInterval();
    return;
  }

  async deleteAllRepos() {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(GithubRepos)
      .execute();
  }
}
