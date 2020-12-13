import * as fs from 'fs';
import { ChangesFormat, ChangesReturnFormat } from '../../models/change-list';
import performReplace from './change-functions/perform-replace';
import installNodePackage from '../utilities/install-node-package';
import unInstallNodePackage from '../utilities/un-install-node-package';
import runShellCommand from '../utilities/run-shell-command';
import evaluateFunctionName from './change-functions/eval-func';

function performChanges(changeObject: ChangesFormat) {
  const changesList = getChangesList(changeObject);

  const changeLog: Array<ChangesReturnFormat> = [];

  for (const change of changesList) {
    const obj = { id: change.id, operations: [] };
    for (const operation of change.operations) {
      switch (operation.type) {
        case 'replace':
          obj.operations.push({
            changeType: 'replace',
            value: performReplace(changeObject.path, operation.metadata)
          });
          break;
        case 'install':
          obj.operations.push({
            changeType: 'install',
            value: installNodePackage(operation.metadata, changeObject.path).installed
          });
          break;
        case 'uninstall':
          obj.operations.push({
            changeType: 'uninstall',
            value: unInstallNodePackage(operation.metadata, changeObject.path).uninstalled
          });
          break;
        case 'command':
          const output = runShellCommand(operation.metadata, null, { cwd: changeObject.path });
          if (output.pid === 0) {
            obj.operations.push({
              changeType: 'command',
              value: [ output.stdout ]
            });
          }
          else {
            obj.operations.push({
              changeType: 'command',
              value: [ output.stderr || output.error ]
            });
          }
          break;
        case 'function-call':
          obj.operations.push({
            changeType: 'function-call',
            value: evaluateFunctionName(operation.metadata, changeObject.path)
          });
          break;
        default:
          throw new Error('Unknown change type');
      }
    }
    changeLog.push(obj);
  }

  return changeLog;

}

function getChangesList(changeObject: ChangesFormat) {
  const fileName = `ng${changeObject.from.split('.')[0]}to${changeObject.to.split('.')[0]}.json`;

  const changesJson = JSON.parse(fs.readFileSync(`./server-src/utils/perform-changes/changesLists/${fileName}`, 'utf-8'));

  const changes = [];

  changesJson.beforeUpdate.forEach(m => {
    if (changeObject.changes.includes(m.id)) {
      changes.push({ id: m.id, operations: m.operations });
    }
  });
  changesJson.afterUpdate.forEach(m => {
    if (changeObject.changes.includes(m.id)) {
      changes.push({ id: m.id, operations: m.operations });
    }
  });

  return changes;
}

export default performChanges;
