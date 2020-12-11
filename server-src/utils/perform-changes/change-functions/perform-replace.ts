import * as replace from 'replace-in-file';

import { ReplaceFormat } from '../../../models/change-list';

function performReplace(projectPath: string, replaceList: Array<ReplaceFormat>): Array<string>
{
  if (projectPath.slice(-1) !== '/' && projectPath.slice(-1) !== '\\') {
    projectPath = projectPath + '/';
  }

  const changedFiles = [];

  for (const item of replaceList) {
    const changedFile = replace.sync({
      files: item.fileTypes.map(m => `${projectPath}src\/\*\*/${m}`),
      from: typeof item.from === 'string' ? new RegExp(item.from, 'g') : item.from.map(m => new RegExp(m, 'g')),
      to: item.to
    });

    changedFile.filter(m => m.hasChanged).map(m => m.file).forEach(m => changedFiles.push(m));
  }

  return changedFiles;
}

export default performReplace;
