import { RepoContext } from './types';
import { getLatestCommit } from './get-latest-commit';

export async function createBranch(
  context: RepoContext,
  sourceBranch: string,
  newBranchName: string,
): Promise<void> {
  const latestCommit = await getLatestCommit(context);

  await context.client.post(
    `/repositories/${context.workspace}/${context.repo}/refs/branches`,
    {
      name: newBranchName,
      target: {
        hash: latestCommit,
      },
    },
  );
}
