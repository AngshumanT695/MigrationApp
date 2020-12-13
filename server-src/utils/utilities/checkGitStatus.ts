import runShellCommand from './run-shell-command';
import { breakOutputInLines } from './breakIntoLines';

import { gitStatusFormat } from '../interfaces/interfaces';

function checkGitStatus(pathToNgProj: string): gitStatusFormat {
  const output = runShellCommand('git', ['status', '--porcelain'], { cwd: pathToNgProj });

  if (output.stdout === '') {
    return { clean: true, filesList: null };
  }

  return {
    clean: false,
    filesList: parseGitOutput(output.stdout)
  };
}

function parseGitOutput(gitOutput: string): Array<string> {
  const lines = breakOutputInLines(gitOutput);

  const output: Array<string> = [];

  for (const line of lines) {
    output.push(line.match(/^\w+\s+(.*)$/)[1]);
  }

  return output;
}

export default checkGitStatus;
