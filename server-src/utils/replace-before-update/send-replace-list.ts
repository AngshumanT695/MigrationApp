import * as fs from 'fs';

// From: 6.1.10
// To: 9.1.12
function sendChangesList(updateVerFromTo: { from: string, to: string }): any {

  const fileName = `./server-src/utils/replace-before-update/replaceLists/ng${updateVerFromTo.from.substring(0, updateVerFromTo.from.indexOf('.'))}to${updateVerFromTo.to.substring(0, updateVerFromTo.to.indexOf('.'))}.json`;

  const fileContent = fs.readFileSync(fileName, 'utf-8');

  return JSON.parse(fileContent);
}

export default sendChangesList;
