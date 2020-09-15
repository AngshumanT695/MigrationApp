import { PackageInfo } from '../../models/package-info';
import runShellCommand from '../utilities/run-shell-command';

function getUpdateVersions(updateList: Array<PackageInfo>) {
  if (updateList) {
    return updateList.map((item) => ({
      ...item,
      versions: getNextPackageVersions(item.name, item.current)
    }));
  }
}

function getNextPackageVersions(packageName: string, currentVersion: string): Array<string> {
  const distTags = getDistTags(packageName);
  const currentVersionObj = getVersionObject(currentVersion);

  const nextTags: Array<string> = [];
  for (const tag of distTags) {
    const tagVersionObj = getVersionObject(tag);
    if (tagVersionObj.major > currentVersionObj.major)
      nextTags.push(tag);
    else if (tagVersionObj.major == currentVersionObj.major) {
      if (tagVersionObj.minor > currentVersionObj.minor) nextTags.push(tag);
      else if (tagVersionObj.minor == currentVersionObj.minor && tagVersionObj.patch > currentVersionObj.patch) nextTags.push(tag);
    }
  }

  if (nextTags.length == null) nextTags[0] = currentVersion;

  return nextTags;
}

function getVersionObject(semanticVersion: string): { major: number, minor: number, patch: number } {
  if (/^\d+.\d+.\d+-\w+/.test(semanticVersion))
    semanticVersion = semanticVersion.substring(0, semanticVersion.indexOf('-'));
  const verArr = semanticVersion.split('.');
  return { major: parseInt(verArr[0]), minor: parseInt(verArr[1]), patch: parseInt(verArr[2]) };
}

function getDistTags(packageName: string): Array<string> {
  const output = runShellCommand('npm', ['view', packageName, '-json', 'dist-tags']);

  if (output.status != 0)
    throw output.stderr;

  const distTags: Array<string> = Object.values(JSON.parse(output.stdout.trim()));
  return distTags;
}

export default getUpdateVersions;
