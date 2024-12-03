import { RepoContext } from './types';

export async function getPackageJson(context: RepoContext): Promise<any> {
  try {
    console.log('Fetching package.json...');
    const response = await context.client.get<string>(
      `/repositories/${context.workspace}/${context.repo}/src/${context.branch}/package.json`,
    );
    console.log('Package.json fetched successfully');
    return response;
  } catch (error) {
    console.error('Error fetching package.json:', error);
    throw new Error(`Failed to fetch package.json: ${error}`);
  }
}
