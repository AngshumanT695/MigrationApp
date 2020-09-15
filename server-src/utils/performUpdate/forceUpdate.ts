import runShellCommand from '../utilities/run-shell-command';

import { updateLogFormat } from '../interfaces/interfaces';

export function performForceUpdate(pathToAngularProj: string, ngVersion: string): updateLogFormat {
  const output = runShellCommand('ng', ['update', `@angular/cli@${ngVersion}`, `@angular/core@${ngVersion}`], { cwd: pathToAngularProj });

  return {
    status: output.status,
    stdout: output.stdout,
    stderr: output.stderr
  }
}
