import { UpdateRequest } from '../../models/update-request';
import executeUpdate from '../utilities/execute-update';

function performUpdate(updateRequest: UpdateRequest) {
  const updateOutput = executeUpdate(updateRequest, false, updateRequest.force);
  if (updateOutput.status !== 0){
    throw new Error(updateOutput?.stderr||updateOutput?.error?.message);
  }
  return { message: `Angular update successful` };
}

export default performUpdate;
