import { runCommand } from '../../utilities/runCommand';

import { cmdOutputFormat, updateLogFormat } from '../../interfaces/interfaces';

export function performForceUpdate(pathToAngularProj: string, ngVersion: string): updateLogFormat
{
    const output: cmdOutputFormat = runCommand('ng', ['update', `@angular/cli@${ngVersion}`, `@angular/core@${ngVersion}`], { cwd: pathToAngularProj });

    return {
        status: output.status,
        stdout: output.stdout,
        stderr: output.stderr
    }
}
