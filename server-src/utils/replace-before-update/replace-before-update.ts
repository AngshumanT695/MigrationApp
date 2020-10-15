import * as replace from 'replace-in-file';

import { ChangesFormat } from '../../models/replace-list';

function replaceBeforeUpdate(projectPath: string, changes: Array<ChangesFormat>): Array<string>
{
  if (projectPath.slice(-1) !== '/' && projectPath.slice(-1) !== '\\') {
    projectPath = projectPath + '/';
  }

  const changedFiles = [];

  for (const item of changes) {
    const changedFile = replace.sync({
      files: item['file-types'].map(m => `${projectPath}src/**/${m}`),
      from: new RegExp(item.from, 'g'),
      to: item.to
    });

    changedFile.filter(m => m.hasChanged).map(m => m.file).forEach(m => changedFiles.push(m));
  }

  return changedFiles;
}

export default replaceBeforeUpdate;
