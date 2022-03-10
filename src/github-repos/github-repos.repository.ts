import { EntityRepository, Repository } from 'typeorm';
import { GithubRepos } from './github-repos.entity';

@EntityRepository(GithubRepos)
export class GithubReposRepository extends Repository<GithubRepos> {}
