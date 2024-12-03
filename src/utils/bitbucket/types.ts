import { BitBucketClient } from '../../bitbucket-client';

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface RepoContext {
  client: BitBucketClient;
  workspace: string;
  repo: string;
  branch: string;
}

export interface CommitInfo {
  hash: string;
  date: string;
}

export interface PullRequestResponse {
  id: number;
  title: string;
  links: {
    html: {
      href: string;
    };
  };
}
