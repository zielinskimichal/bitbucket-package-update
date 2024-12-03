import 'dotenv/config';
import { BitBucketClient } from './bitbucket-client';
import { createPrWithUpdatedPackageJson } from './utils';

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

  const context = {
    client: BitBucketClient.getInstance(),
    workspace: args.workspace,
    repo: args.repo,
    branch: args.branch,
  };

  const result = await createPrWithUpdatedPackageJson(
    context,
    args.packageName,
    args.newVersion,
  );

  console.log('Successfully created PR:', result.pullRequest.links.html.href);
}

main();
