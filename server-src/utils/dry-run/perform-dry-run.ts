import runShellCommand from '../utilities/run-shell-command';
import { parseError, parseResult } from './parse-dry-run-result';

import { dryRunResultFormat } from '../interfaces/interfaces';
import { CommandResult } from '../../models/command-result';

export function performDryRun(pathToNgProj: string, ngVersion: string): dryRunResultFormat {
  const dryRunOutput = executeDryRun(pathToNgProj, ngVersion);
  const parsedOutput = parseDryRun(dryRunOutput);
  return parsedOutput;
}

function parseDryRun(dryRunOutput: CommandResult): dryRunResultFormat {
  let parsedOutput: dryRunResultFormat;
  if (dryRunOutput.status === 0)
    parsedOutput = parseResult(dryRunOutput);
  else if (dryRunOutput.status === 1)
    parsedOutput = parseError(dryRunOutput);

  return parsedOutput;
}

function executeDryRun(pathToNgProj: string, ngVersion: string): CommandResult {
  const output = runShellCommand('ng', ['update', `@angular/core@${ngVersion}`, `@angular/cli@${ngVersion}`, '-d'], { cwd: pathToNgProj });
  return output;
}
