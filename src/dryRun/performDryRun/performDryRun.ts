import { runCommand } from '../../utilities/runCommand';
import { parseForError, parseForNoError } from './parseDryRun';

import { dryRunResultFormat, cmdOutputFormat } from '../../interfaces/interfaces';

export function performDryRun(pathToNgProj: string, ngVersion: string): dryRunResultFormat
{
    const dryRunOutput: cmdOutputFormat = executeDryRun(pathToNgProj, ngVersion);
    
    const parsedOutput: dryRunResultFormat = parseDryRun(dryRunOutput);

    return parsedOutput;
}

function parseDryRun(dryRunOutput: cmdOutputFormat): dryRunResultFormat
{
    let parsedOutput: dryRunResultFormat;
    if(dryRunOutput.status == 0)
        parsedOutput = parseForNoError(dryRunOutput);
    else if(dryRunOutput.status == 1)
        parsedOutput = parseForError(dryRunOutput);

    return parsedOutput;
}

function executeDryRun(pathToNgProj: string, ngVersion: string): cmdOutputFormat
{
    const output = runCommand('ng', ['update', `@angular/core@${ngVersion}`, `@angular/cli@${ngVersion}`, '-d'], { cwd: pathToNgProj });
    
    return output;
}
