import * as replace from 'replace-in-file';

function removeHttp(filePath: string, fileContent: string, httpVarName: string): Array<string> {

  const regEx = new RegExp(`this\\.${httpVarName}\\.\\w+\\s*\\(\\s*['"\`](?:http:\/)?(?:\/?\\w+\\:?\\.?)+['"\`]\\s*\\)\\s*(\\.\\s*pipe\\(+map\\(+\\s*(\\w+)\\s*\\:?\\s*\\w*\\)*\\s*=>\\s*(\\w+)\\.json\\(\\)\\s*\\)+\\s*\\)+)\\s*\\.\\s*(subscribe\\(+\\s*(\\w+)\\s*\\:?\\s*\\w*\\)*\\s+=>)`, 'g');

  const matchingContent = Array.from(fileContent.matchAll(regEx)) || [];

  const spString = '[\\^$.|?*+()';

  const changedFiles: Array<string> = [];

  for (const matches of matchingContent) {
    let result = '';
    for (const match of matches[1]) {
      if (spString.includes(match)) { result += '\\' + match; }
      else { result += match; }
    }

    const testReg1 = new RegExp(result);
    const testReg2 = new RegExp(/subscribe\s*\(+\s*\w+\s*\)?\s*=>/);

    const options: any = {};

    if (matches[2] === matches[3] && testReg2.test(matches[4])) {
      options.files = filePath;
      options.from = [testReg1, testReg2];
      options.to = ['', `subscribe((${matches[5]}: any) =>`];
    } else if (matches[2] === matches[3]) {
      options.files = filePath;
      options.from = testReg1;
      options.to = '';
    }

    try {
      const files = replace.sync(options);
      files.filter(m => m.hasChanged)
      .map(m => m.file)
      .forEach(m => {
        if (!changedFiles.includes(m)) {
          changedFiles.push(m);
        }
      });
    } catch (ex) {
      console.log(ex.message);
    }

  }

  return changedFiles;
}

export default removeHttp;
