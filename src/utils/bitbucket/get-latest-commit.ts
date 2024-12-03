import { CommitInfo, RepoContext } from './types';

export async function getLatestCommit(context: RepoContext): Promise<string> {
  const response = await context.client.get<{ values: CommitInfo[] }>(
    `/repositories/${context.workspace}/${context.repo}/commits/${context.branch}`,
  );

  if (!response.values?.[0]?.hash) {
    throw new Error('Could not get latest commit hash');
  }

  return response.values[0].hash;
}
