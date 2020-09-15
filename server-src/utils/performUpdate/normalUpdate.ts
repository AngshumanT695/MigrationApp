import runShellCommand from '../utilities/run-shell-command';

import { updateLogFormat } from '../interfaces/interfaces';

export function performUpdate(pathToNgProj: string, version: string): updateLogFormat {
  const output = runShellCommand('ng', ['update', `@angular/cli@${version}`, `@angular/core@${version}`], { cwd: pathToNgProj });

  return {
    status: output.status,
    stdout: output.stdout,
    stderr: output.stderr
  }
}
