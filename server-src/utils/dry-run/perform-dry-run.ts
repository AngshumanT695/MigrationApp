import { parseError, parseResult } from './parse-dry-run-result';
import { CommandResult } from '../../models/command-result';
import { UpdateRequest } from '../../models/update-request';
import executeUpdate from '../utilities/execute-update';

function performDryRun(updateRequest: UpdateRequest) {
  const dryRunOutput = executeUpdate(updateRequest, true, false);
  const parsedOutput = parseDryRun(dryRunOutput);
  return parsedOutput;
}

function parseDryRun(dryRunOutput: CommandResult) {
  const result: any = {};
  result.status = dryRunOutput.status;
  if (dryRunOutput.status === 1) {
    result.updateList = null;
    result.errorList = parseError(dryRunOutput);
  }
  else if (dryRunOutput.status === 0){
    result.updateList = parseResult(dryRunOutput);
    result.errorList = null;
  }
  else {
    throw new Error('Unknown error occurred');
  }
  return result;
}

export default performDryRun;
