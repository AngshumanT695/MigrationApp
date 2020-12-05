import searchForHttp from './search-http';
import removeHttp from './remove-http';

function resolveHttp(projPath: string) {
  const files = searchForHttp(`${projPath}/src/`, /.*\.ts$/);

  const changedFiles: Array<string> = [];

  for (const file of files) {
    removeHttp(file.relPath, file.content, file.httpVarName)
    .forEach(m => changedFiles.push(m));
  }

  return changedFiles;
}

export default resolveHttp;
