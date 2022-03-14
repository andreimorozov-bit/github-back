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
    // set default settings for automatic synchronization
    numberOfItems: 25,
    updateInterval: 20,
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
    // synchronize the database after module initialization
    // and start updating it on corresponding time intervals
    await this.syncGithub();
    this.startUpdateInterval();
  }

  async startUpdateInterval() {
    // start updating the database every x minutes
    await this.checkUpdateInterval();
    this.settings.theInterval = setInterval(async () => {
      await this.syncGithub();
    }, this.settings.updateInterval * 1000 * 60);
  }

  stopUpdateInterval() {
    // stop automatic synchronization of repositories in the database
    clearInterval(this.settings.theInterval);
  }

  async checkUpdateInterval() {
    // check if update interval is stored in the database
    // and set the local variable for it
    // if no interval is in the database use default (20 minutes)
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
    // delete all repositories stored in the database
    // and get new ones from github API
    await this.deleteAllRepos();
    await this.updateRepos();
  }

  async getRepos(): Promise<GithubRepos[]> {
    // select all repositoriaes from the database ordered by stars desc
    const query = this.githubReposRepository.createQueryBuilder('github_repos');
    query.orderBy('github_repos.stargazers_count', 'DESC');
    const githubRepos = await query.getMany();
    return githubRepos;
  }

  async getReposById(id: string): Promise<GithubRepos> {
    // select repository from the database by id
    const query = this.githubReposRepository.createQueryBuilder('github_repos');
    query.where({ id });
    const githubRepos = await query.getOne();
    return githubRepos;
  }

  async getReposBySearch(search: string): Promise<GithubRepos[]> {
    // select repositories from the database by part of id or name
    // ordered by stars desc
    const query = this.githubReposRepository.createQueryBuilder('github_repos');
    query.where({ name: ILike(`%${search}%`) });
    query.orWhere({ id: ILike(`%${search}%`) });
    query.orderBy('github_repos.stargazers_count', 'DESC');
    const githubRepos = await query.getMany();
    return githubRepos;
  }

  async updateRepos(): Promise<AxiosResponse<unknown>> {
    // get repositories with the most number of stars from github API
    // and store them in the database
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
    // get update interval in minutes from the database
    const query =
      this.githubSettingsRepository.createQueryBuilder('github_settings');
    return await query.getOne();
  }

  async setSettings(
    // create settings in the database or update if exist
    // force synchronization to set new update interval
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
    // stop currently running update interval
    // force database synchronisation with github API
    // start new interval
    this.stopUpdateInterval();
    await this.syncGithub();
    this.startUpdateInterval();
    return;
  }

  async deleteAllRepos() {
    // delete all repositories from the database
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(GithubRepos)
      .execute();
  }
}
