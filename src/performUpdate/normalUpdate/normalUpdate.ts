import { runCommand } from '../../utilities/runCommand';

import { cmdOutputFormat, updateLogFormat } from '../../interfaces/interfaces';

export function performUpdate(pathToNgProj: string, version: string): updateLogFormat
{
    const output: cmdOutputFormat = runCommand('ng', ['update', `@angular/cli@${version}`, `@angular/core@${version}`], { cwd: pathToNgProj });

    return {
        status: output.status,
        stdout: output.stdout,
        stderr: output.stderr
    }
}
