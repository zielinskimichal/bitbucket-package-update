import { RepoContext } from './types';
import { getLatestCommit } from './get-latest-commit';

export async function createBranch(
  context: RepoContext,
  sourceBranch: string,
  newBranchName: string,
): Promise<void> {
  try {
    const latestCommit = await getLatestCommit(context);
    console.log('Creating branch with latest commit:', latestCommit);

    await context.client.post(
      `/repositories/${context.workspace}/${context.repo}/refs/branches`,
      {
        name: newBranchName,
        target: {
          hash: latestCommit,
        },
      },
    );
    console.log('Branch created successfully');
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
}
