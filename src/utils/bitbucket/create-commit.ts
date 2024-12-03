import { RepoContext } from './types';

export async function createCommit(
  context: RepoContext,
  branchName: string,
  filePath: string,
  content: string,
  message: string,
): Promise<void> {
  try {
    console.log('Creating commit with content length:', content.length);

    const formData = new FormData();
    formData.append('message', message);
    formData.append('branch', branchName);

    // Create a Blob and append it as a file
    const blob = new Blob([content], { type: 'application/json' });
    formData.append(filePath, blob, filePath);

    console.log('Sending commit request...');
    await context.client.post(
      `/repositories/${context.workspace}/${context.repo}/src`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log('Commit created successfully');
  } catch (error) {
    console.error('Error creating commit:', error);
    throw error;
  }
}
