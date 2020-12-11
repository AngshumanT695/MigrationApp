import * as fs from 'fs';
import performReplace from './change-functions/perform-replace';
import installNodePackage from '../utilities/install-node-package';
import unInstallNodePackage from '../utilities/un-install-node-package';
import runShellCommand from '../utilities/run-shell-command';
import evaluateFunctionName from './change-functions/eval-func';

function performChanges(changeObject: { path: string, from: string, to: string, changes: Array<string> }) {
  const changesList = getChangesList(changeObject);

  const changeLog: Array<{ changeType: string, value: string }> = [];

  for (const change of changesList) {
    const changeType = change.type;
    switch (changeType) {
      case 'replace':
        performReplace(changeObject.path, change.metadata).forEach(m => changeLog.push({ changeType: 'replace', value: m }));
        break;
      case 'install':
        installNodePackage(change.metadata, changeObject.path);
        changeLog.push({ changeType: 'install', value: change.metadata });
        break;
      case 'uninstall':
        unInstallNodePackage(change.metadata, changeObject.path);
        changeLog.push({ changeType: 'uninstall', value: change.metadata });
        break;
      case 'command':
        const output = runShellCommand(change.metadata, null, { cwd: changeObject.path });
        if (output.pid === 0) { changeLog.push({ changeType: 'command', value: output.stdout }); }
        else { throw new Error(output.stderr); }
        break;
      case 'function-call':
        const returnVal = evaluateFunctionName(change.metadata, changeObject.path);
        changeLog.push({ changeType: 'function-call', value: returnVal });
        break;
      default:
        throw new Error('Unknown change type');
    }
  }

  return changeLog;

}

function getChangesList(changeObject: { path: string, from: string, to: string, changes: Array<string> }) {
  const fileName = `ng${changeObject.from}to${changeObject.to}.json`;

  const changesJson = JSON.parse(fs.readFileSync(`./server-src/utils/perform-changes/changesLists/${fileName}`, 'utf-8'));

  const changes = [];

  changesJson.beforeUpdate.forEach(m => {
    if (changeObject.changes.includes(m.id)) {
      m.operations.forEach(n => changes.push(n));
    }
  });
  changesJson.afterUpdate.forEach(m => {
    if (changeObject.changes.includes(m.id)) {
      m.operations.forEach(n => changes.push(n));
    }
  });

  return changes;
}

export default performChanges;
