import { CommitInfo, RepoContext } from './types';

export async function getLatestCommit(context: RepoContext): Promise<string> {
  try {
    const response = await context.client.get<{ values: CommitInfo[] }>(
      `/repositories/${context.workspace}/${context.repo}/commits/${context.branch}`,
    );
    console.log('Latest commit response:', response);
    if (!response.values?.[0]?.hash) {
      throw new Error('Could not get latest commit hash');
    }
    return response.values[0].hash;
  } catch (error) {
    console.error('Error getting latest commit:', error);
    throw error;
  }
}
