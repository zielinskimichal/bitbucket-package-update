import { PullRequestResponse, RepoContext } from './types';

export async function createPullRequest(
  context: RepoContext,
  sourceBranch: string,
  packageName: string,
  newVersion: string,
): Promise<PullRequestResponse> {
  try {
    console.log('Creating pull request...');

    const title = `Update ${packageName} to version ${newVersion}`;
    const description = `This PR updates ${packageName} to version ${newVersion}.\n\nAutomatically generated by package update script.`;

    const response = await context.client.post<PullRequestResponse>(
      `/repositories/${context.workspace}/${context.repo}/pullrequests`,
      {
        title,
        description,
        source: {
          branch: {
            name: sourceBranch,
          },
        },
        destination: {
          branch: {
            name: context.branch,
          },
        },
      },
    );

    console.log('Pull request created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating pull request:', error);
    throw new Error(`Failed to create pull request: ${error}`);
  }
}
