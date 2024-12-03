import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PullRequestResponse, RepoContext } from './types';
import { createPullRequest } from './create-pr';

const execAsync = promisify(exec);

async function checkFileExists(filepath: string) {
  try {
    await fs.access(filepath, fs.constants.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

export class PackageUpdateService {
  private context: RepoContext;
  private tempDirectoryPath: string;
  private username: string;
  private appPassword: string;
  private bitbucketDomain: string;

  constructor(context: RepoContext) {
    this.context = context;
    this.tempDirectoryPath = path.join(`${context.repo}-${Date.now()}`);
    this.username = process.env.BITBUCKET_USERNAME ?? '';
    this.appPassword = process.env.BITBUCKET_APP_PASSWORD ?? '';
    this.bitbucketDomain = process.env.BITBUCKET_DOMAIN ?? '';

    if (!this.username || !this.appPassword || !this.bitbucketDomain) {
      throw new Error(
        'BitBucket credentials not found in environment variables',
      );
    }
  }

  async setup(): Promise<void> {
    const repoUrl = `https://${encodeURIComponent(this.username)}:${encodeURIComponent(this.appPassword)}@${this.bitbucketDomain}/${this.context.workspace}/${this.context.repo}.git`;
    await execAsync(`git clone ${repoUrl} ${this.tempDirectoryPath}`);

    await execAsync(
      `git config user.name "${process.env.GIT_USER_NAME || 'Dependency Bot'}"`,
      { cwd: this.tempDirectoryPath },
    );

    await execAsync(
      `git config user.email "${process.env.GIT_USER_EMAIL || 'bot@example.com'}"`,
      { cwd: this.tempDirectoryPath },
    );

    await execAsync(`git checkout ${this.context.branch}`, {
      cwd: this.tempDirectoryPath,
    });
  }

  private async detectPackageManager(): Promise<'yarn' | 'npm' | 'pnpm'> {
    if (await checkFileExists(path.join(this.tempDirectoryPath, 'yarn.lock'))) {
      return 'yarn';
    } else if (
      await checkFileExists(
        path.join(this.tempDirectoryPath, 'package-lock.json'),
      )
    ) {
      return 'npm';
    } else if (
      await checkFileExists(path.join(this.tempDirectoryPath, 'pnpm-lock.yaml'))
    ) {
      return 'pnpm';
    }
    throw new Error('Could not detect package manager');
  }

  async createBranch(branchName: string): Promise<void> {
    await execAsync(`git checkout -b ${branchName}`, {
      cwd: this.tempDirectoryPath,
    });
  }

  async updateDependency(
    packageName: string,
    newVersion: string,
    packageManager: 'yarn' | 'npm' | 'pnpm',
  ): Promise<void> {
    let command = '';

    switch (packageManager) {
      case 'yarn':
        command = `yarn upgrade ${packageName}@${newVersion} --exact`;
        break;
      case 'npm':
        command = `npm install ${packageName}@${newVersion} --save-exact`;
        break;
      case 'pnpm':
        command = `pnpm install ${packageName}@${newVersion} --save-exact`;
        break;
    }

    await execAsync(command, { cwd: this.tempDirectoryPath });
  }

  async commitAndPush(
    branchName: string,
    packageName: string,
    newVersion: string,
  ): Promise<void> {
    const message = `Update ${packageName} to version ${newVersion}`;

    await execAsync('git add .', { cwd: this.tempDirectoryPath });

    await execAsync(`git commit -m "${message}"`, {
      cwd: this.tempDirectoryPath,
    });

    await execAsync(`git push origin ${branchName}`, {
      cwd: this.tempDirectoryPath,
    });
  }

  async updatePackage(
    packageName: string,
    newVersion: string,
  ): Promise<PullRequestResponse> {
    try {
      await this.setup();

      const timestamp = new Date().getTime();
      const branchName = `update-${packageName}-${timestamp}`;

      await this.createBranch(branchName);

      const packageManager = await this.detectPackageManager();

      await this.updateDependency(packageName, newVersion, packageManager);

      await this.commitAndPush(branchName, packageName, newVersion);

      return createPullRequest(
        this.context,
        branchName,
        packageName,
        newVersion,
      );
    } finally {
      await this.cleanup();
    }
  }

  async cleanup(): Promise<void> {
    try {
      await fs.rm(this.tempDirectoryPath, { recursive: true, force: true });
    } catch (error) {
      // noop
    }
  }
}
