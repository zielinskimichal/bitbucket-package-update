import { Command } from 'commander';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program
    .name('package-updater')
    .description('Updates package.json in BitBucket repo and creates a PR')
    .requiredOption('-p, --package <name>', 'package name to update')
    .requiredOption('-n, --new-version <version>', 'new version to set')
    .requiredOption('-r, --repo <repository>', 'BitBucket repository in format workspace/repo-name')
    .option('-b, --branch <branch>', 'base branch name', 'main')
    .parse(process.argv);

const options = program.opts();

async function main() {
    try {
        console.log('Starting package update with options:', options);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();