import { runCommand } from './runCommand';

import { gitStatusFormat } from '../interfaces/interfaces';

export function checkGitStatus(pathToNgProj: string): gitStatusFormat
{
    const output = runCommand('git', ['status', '--porcelain'], { cwd: pathToNgProj });

    if(output.stdout === '')
        return { clean: true, filesList: null };

    return { clean: false, filesList: output.stdout };
}
