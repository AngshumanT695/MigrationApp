import runShellCommand from '../utilities/run-shell-command';
import parseNgUpdateResult from './parse-upgrade-result';

function getUpdateList(pathToAngularProj: string) {
  const output = runShellCommand('ng', ['update'], { cwd: pathToAngularProj });

  if (output.status !== 0) {
    throw new Error(output.stderr);
  }

  const updateArr = parseNgUpdateResult(output.stdout);
  return updateArr;
}

export default getUpdateList;
