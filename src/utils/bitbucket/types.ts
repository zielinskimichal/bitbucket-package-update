import { BitBucketClient } from './bitbucket-client';

export interface RepoContext {
  client: BitBucketClient;
  workspace: string;
  repo: string;
  branch: string;
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
