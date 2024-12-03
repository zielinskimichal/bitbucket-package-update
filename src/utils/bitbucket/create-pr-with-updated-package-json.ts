import { createCommit } from './create-commit';
import { RepoContext } from './types';
import { getPackageJson } from './get-package-json';
import { updatePackageVersion } from './update-package-version-in-package-json';
import { createBranch } from './create-branch';
import { createPullRequest } from './create-pr';

export async function updatePackageJsonInRepo(
  context: RepoContext,
  packageName: string,
  newVersion: string,
): Promise<any> {
  try {
    console.log('Starting package.json update process...');

    // 1. Get current package.json
    const packageJson = await getPackageJson(context);
    console.log('Current package.json:', packageJson);

    // 2. Update the version
    const updatedPackageJson = updatePackageVersion(
      packageJson,
      packageName,
      newVersion,
    );
    console.log('Updated package.json:', updatedPackageJson);

    // 3. Create a new branch name
    const timestamp = new Date().getTime();
    const branchName = `update-${packageName}-${timestamp}`;
    console.log('New branch name:', branchName);

    // 4. Create the new branch from the current branch
    await createBranch(context, context.branch, branchName);

    // 5. Commit updated package.json
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
  } catch (error) {
    console.error('Error in updatePackageJsonInRepo:', error);
    throw new Error(`Failed to update package.json: ${error}`);
  }
}
