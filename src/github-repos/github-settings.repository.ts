import { EntityRepository, Repository } from 'typeorm';
import { GithubSettings } from './github-settings.entity';

@EntityRepository(GithubSettings)
export class GithubSettingsRepository extends Repository<GithubSettings> {}
