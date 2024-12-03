import { PackageJson, RepoContext } from './types';

export async function getPackageJson(
  context: RepoContext,
): Promise<PackageJson> {
  return context.client.get<PackageJson>(
    `/repositories/${context.workspace}/${context.repo}/src/${context.branch}/package.json`,
  );
}
