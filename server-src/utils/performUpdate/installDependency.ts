import runShellCommand from '../utilities/run-shell-command';

import { updateLogFormat } from '../interfaces/interfaces';

export function installDependency(dependencyName: string, pathToNgProj: string): updateLogFormat
{
    const output = runShellCommand('npm', ['install', dependencyName], { cwd: pathToNgProj });

    if(output.status == 0)
        return { status: 0, stdout: null, stderr: null }
    else
        return { status: 1, stdout: output.stdout, stderr: output.stderr };
}
