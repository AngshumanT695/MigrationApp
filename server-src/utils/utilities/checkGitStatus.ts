import runShellCommand from './run-shell-command';

import { gitStatusFormat } from '../interfaces/interfaces';

export function checkGitStatus(pathToNgProj: string): gitStatusFormat {
  const output = runShellCommand('git', ['status', '--porcelain'], { cwd: pathToNgProj });

  if (output.stdout === '')
    return { clean: true, filesList: null };

  return { clean: false, filesList: output.stdout };
}
