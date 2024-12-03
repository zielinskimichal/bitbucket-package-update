import { RepoContext } from './types';

export async function createCommit(
  context: RepoContext,
  branchName: string,
  filePath: string,
  content: string,
  message: string,
): Promise<void> {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('branch', branchName);

  const blob = new Blob([content], { type: 'application/json' });
  formData.append(filePath, blob, filePath);

  await context.client.post(
    `/repositories/${context.workspace}/${context.repo}/src`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}
