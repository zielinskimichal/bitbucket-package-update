import { createCommit } from './create-commit';
import { RepoContext } from './types';
import { getPackageJson } from './get-package-json';
import { updatePackageVersionInPackageJson } from './update-package-version-in-package-json';
import { createBranch } from './create-branch';
import { createPullRequest } from './create-pr';

export async function createPrWithUpdatedPackageJson(
  context: RepoContext,
  packageName: string,
  newVersion: string,
): Promise<any> {
  const packageJson = await getPackageJson(context);

  const updatedPackageJson = updatePackageVersionInPackageJson(
    packageJson,
    packageName,
    newVersion,
  );

  const timestamp = new Date().getTime();

  const branchName = `update-${packageName}-${timestamp}`;

  await createBranch(context, context.branch, branchName);

  await createCommit(
    context,
    branchName,
    'package.json',
    JSON.stringify(updatedPackageJson, null, 2),
    `Update ${packageName} to version ${newVersion}`,
  );

  const pullRequest = await createPullRequest(
    context,
    branchName,
    packageName,
    newVersion,
  );

  return {
    branchName,
    pullRequest,
  };
}
