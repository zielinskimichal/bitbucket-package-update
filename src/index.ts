import 'dotenv/config';
import { Command } from 'commander';
import { BitBucketClient } from './bitbucket-client';
import { createPrWithUpdatedPackageJson } from './utils';

const program = new Command();

program
  .name('package-updater')
  .description('Updates package.json in BitBucket repo and creates a PR')
  // .requiredOption('-p, --package <name>', 'package name to update')
  // .requiredOption('-n, --new-version <version>', 'new version to set')
  // .requiredOption(
  //   '-r, --repo <repository>',
  //   'BitBucket repository in format workspace/repo-name',
  // )
  .option('-b, --branch <branch>', 'base branch name', 'main')
  .parse(process.argv);

// const options = program.opts();

async function main() {
  try {
    try {
      const context = {
        client: BitBucketClient.getInstance(),
        workspace: 'tria-day-test',
        repo: 'sample-repo',
        branch: 'main',
      };

      const branchName = await createPrWithUpdatedPackageJson(
        context,
        'axios',
        '1.7.9',
      );
      console.log(branchName);
    } catch (error) {
      console.error('Failed to connect to BitBucket:', error);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
