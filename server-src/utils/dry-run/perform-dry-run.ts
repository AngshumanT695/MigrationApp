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
  if (dryRunOutput.status !== 0) {
    const result = parseError(dryRunOutput);
    console.log(result);
    throw result;
  }
  return parseResult(dryRunOutput);
}

export default performDryRun;
