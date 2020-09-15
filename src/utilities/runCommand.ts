import * as cp from 'child_process';

import { cmdOutputFormat } from '../interfaces/interfaces';

export function runCommand(command: string, args: string[] = null, options: any = null): cmdOutputFormat
{
    let output: any;
    if(args === null && options === null)
        output = cp.spawnSync(command);
    else if(options === null)
        output = cp.spawnSync(command, args);
    else
        output = cp.spawnSync(command, args, options);

    const formattedOutput: cmdOutputFormat = { 
        pid: output.pid,
        status: output.status,
        signal: output.signal,
        stdout: output.stdout.toString(),
        stderr: output.stderr.toString(),
        error: output.error
    }

    return formattedOutput;
}
