import { SpawnSyncReturns } from 'child_process';
import * as spawn from 'cross-spawn';
import { CommandResult } from '../../models/command-result';

function runShellCommand(command: string, args: string[] = null, options: any = null) {
  let output: SpawnSyncReturns<Buffer | string>;
  if (args === null && options === null)
    output = spawn.sync(command);
  else if (options === null)
    output = spawn.sync(command, args);
  else
    output = spawn.sync(command, args, options);

  const formattedOutput: CommandResult = {
    pid: output.pid,
    status: output.status,
    signal: +output.signal,
    stdout: output.stdout && output.stdout.toString(),
    stderr: output.stderr && output.stderr.toString(),
    error: output.error
  }

  return formattedOutput;
}

export default runShellCommand;
