import 'dotenv/config';
import { BitBucketClient } from './bitbucket-client';
import { createPrWithUpdatedPackageJson } from './utils';
import { createSpinner } from './utils';

interface ScriptArgs {
  packageName: string;
  newVersion: string;
  workspace: string;
  repo: string;
  branch: string;
}

function parseArgs(): ScriptArgs {
  const [, , packageName, newVersion, workspace, repo, branch] = process.argv;

  if (!packageName || !newVersion || !workspace || !repo || !branch) {
    console.error(
      'Usage: node dist/src/index.js <package-name> <new-version> <workspace> <repo> <branch>',
    );
    console.error(
      'Example: node dist/src/index.js axios 1.7.9 tria-day-test sample-repo main',
    );
    process.exit(1);
  }

  return {
    packageName,
    newVersion,
    workspace,
    repo,
    branch,
  };
}

async function main() {
  const args = parseArgs();
  let spinner = createSpinner('Initializing BitBucket client...');

  try {
    spinner.start();
    const context = {
      client: BitBucketClient.getInstance(),
      workspace: args.workspace,
      repo: args.repo,
      branch: args.branch,
    };

    spinner.stop(true);

    spinner = createSpinner(
      `Creating PR for ${args.packageName}@${args.newVersion}...`,
    );

    spinner.start();

    const result = await createPrWithUpdatedPackageJson(
      context,
      args.packageName,
      args.newVersion,
    );

    spinner.stop(true);
    console.log(`✓ Created a PR: ${result.pullRequest.links.html.href}`);
  } catch (error) {
    spinner.stop(true);
    console.error(
      `✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    process.exit(1);
  }
}

main();
