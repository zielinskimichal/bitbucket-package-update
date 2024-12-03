import { PackageJson } from './types';

export function updatePackageVersion(
  packageJson: PackageJson,
  packageName: string,
  newVersion: string,
): PackageJson {
  const updated = { ...packageJson };
  let wasUpdated = false;

  const dependencyTypes: (keyof PackageJson)[] = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ];

  for (const type of dependencyTypes) {
    if (updated[type]?.[packageName]) {
      updated[type] = {
        ...updated[type],
        [packageName]: newVersion,
      };
      wasUpdated = true;
    }
  }

  if (!wasUpdated) {
    throw new Error(`Package ${packageName} not found in any dependencies`);
  }

  return updated;
}
