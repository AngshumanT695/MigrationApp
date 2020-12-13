import * as fs from 'fs';

// From: 6.1.10
// To: 9.1.12
const sendChangesList = async (updateVerFromTo: { from: string, to: string }): Promise<any> => {

  const fileName = `./server-src/utils/perform-changes/changesLists/ng${updateVerFromTo.from.substring(0, updateVerFromTo.from.indexOf('.'))}to${updateVerFromTo.to.substring(0, updateVerFromTo.to.indexOf('.'))}.json`;

  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        reject(new Error(`Angular update to version ${updateVerFromTo.to} is not supported yet. Please try to update to some other Angular version.`));
      } else {
        resolve(JSON.parse(data));
      }
    });
  });

}

export default sendChangesList;
