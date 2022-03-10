import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Owner } from './models/owner.model';
import { License } from './models/license.model';
import { Permissions } from './models/permissions.model';

@Entity()
export class GithubRepos {
  @PrimaryGeneratedColumn('uuid')
  pk: string;

  @Column({ nullable: true })
  id: string;

  @Column({ nullable: true })
  node_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  private: boolean;

  @Column({ type: 'jsonb', nullable: true })
  owner: Owner;

  @Column({ nullable: true })
  html_url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  fork: boolean;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  forks_url: string;

  @Column({ nullable: true })
  keys_url: string;

  @Column({ nullable: true })
  collaborators_url: string;

  @Column({ nullable: true })
  teams_url: string;

  @Column({ nullable: true })
  hooks_url: string;

  @Column({ nullable: true })
  issue_events_url: string;

  @Column({ nullable: true })
  events_url: string;

  @Column({ nullable: true })
  assignees_url: string;

  @Column({ nullable: true })
  branches_url: string;

  @Column({ nullable: true })
  tags_url: string;

  @Column({ nullable: true })
  blobs_url: string;

  @Column({ nullable: true })
  git_tags_url: string;

  @Column({ nullable: true })
  git_refs_url: string;

  @Column({ nullable: true })
  trees_url: string;

  @Column({ nullable: true })
  statuses_url: string;

  @Column({ nullable: true })
  languages_url: string;

  @Column({ nullable: true })
  stargazers_url: string;

  @Column({ nullable: true })
  contributors_url: string;

  @Column({ nullable: true })
  subscribers_url: string;

  @Column({ nullable: true })
  subscription_url: string;

  @Column({ nullable: true })
  commits_url: string;

  @Column({ nullable: true })
  git_commits_url: string;

  @Column({ nullable: true })
  comments_url: string;

  @Column({ nullable: true })
  issue_comment_url: string;

  @Column({ nullable: true })
  contents_url: string;

  @Column({ nullable: true })
  compare_url: string;

  @Column({ nullable: true })
  merges_url: string;

  @Column({ nullable: true })
  archive_url: string;

  @Column({ nullable: true })
  downloads_url: string;

  @Column({ nullable: true })
  issues_url: string;

  @Column({ nullable: true })
  pulls_url: string;

  @Column({ nullable: true })
  milestones_url: string;

  @Column({ nullable: true })
  notifications_url: string;

  @Column({ nullable: true })
  labels_url: string;

  @Column({ nullable: true })
  releases_url: string;

  @Column({ nullable: true })
  deployments_url: string;

  @Column({ nullable: true })
  created_at: string;

  @Column({ nullable: true })
  updated_at: string;

  @Column({ nullable: true })
  pushed_at: string;

  @Column({ nullable: true })
  git_url: string;

  @Column({ nullable: true })
  ssh_url: string;

  @Column({ nullable: true })
  clone_url: string;

  @Column({ nullable: true })
  svn_url: string;

  @Column({ nullable: true })
  homepage: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  stargazers_count: number;

  @Column({ nullable: true })
  watchers_count: number;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  has_issues: boolean;

  @Column({ nullable: true })
  has_projects: boolean;

  @Column({ nullable: true })
  has_downloads: boolean;

  @Column({ nullable: true })
  has_wiki: boolean;

  @Column({ nullable: true })
  has_pages: boolean;

  @Column({ nullable: true })
  forks_count: number;

  @Column({ nullable: true })
  mirror_url: string;

  @Column({ nullable: true })
  archived: boolean;

  @Column({ nullable: true })
  disabled: boolean;

  @Column({ nullable: true })
  open_issues_count: number;

  @Column({ type: 'jsonb', nullable: true })
  license: License;

  @Column({ nullable: true })
  allow_forking: boolean;

  @Column({ nullable: true })
  is_template: boolean;

  @Column('text', { array: true, nullable: true })
  topics: string[];

  @Column({ nullable: true })
  visibility: string;

  @Column({ nullable: true })
  forks: number;

  @Column({ nullable: true })
  open_issues: number;

  @Column({ nullable: true })
  watchers: number;

  @Column({ nullable: true })
  default_branch: string;

  @Column({ type: 'jsonb', nullable: true })
  permissions: Permissions;

  @Column({ nullable: true })
  score: number;
}
