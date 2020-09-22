import { UpdateRequest } from '../../models/update-request';
import { CommandResult } from '../../models/command-result';
import runShellCommand from './run-shell-command';

function executeUpdate(updateRequest: UpdateRequest, dryRun = false, force = false): CommandResult {
  if (!updateRequest?.packages?.every(_package => !!_package?.upgradeTo) || !updateRequest?.path) {
    throw new Error('Invalid update request');
  }
  const updates = updateRequest.packages.map(_package => `${_package.name}@${_package.upgradeTo}`);
  const output = runShellCommand('ng', ['update', ...updates, `--dry-run=${dryRun}`, `--force=${force}`], { cwd: updateRequest.path });
  return output;
}

export default executeUpdate;
