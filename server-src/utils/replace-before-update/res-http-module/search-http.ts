import * as fs from 'fs';

function searchForHttp(searchPath: string, fileType: RegExp):
  Array<{relPath: string, content: string, httpVarName: string}> {

  const files: Array<{relPath: string, content: string, httpVarName: string}> = [];

  function performSearch(filePath: string) {
    const dirents = fs.readdirSync(filePath, {withFileTypes: true});

    for (const dirent of dirents) {

      if (dirent.isDirectory()) {
        performSearch(filePath + `${dirent.name}/`);
      }

      if (fileType.test(dirent.name)) {
        const fileContent = fs.readFileSync(`${filePath}${dirent.name}`, 'utf8');

        const match = fileContent.match(/(?:constructor).*\s+(\w+)\:\s*(?:HttpClient)/s);

        if (!!match) {
          files.push({
            relPath: `${filePath}${dirent.name}`,
            content: fileContent,
            httpVarName: match[1]
          });
        }

      }

    }

  }

  performSearch(searchPath);

  return files;
}

export default searchForHttp;
