import * as fs from 'fs';
import { join } from 'path';

function checkNgProject(path: string) {
  if (!path) {
    throw new Error("The provided path is invalid. Please provide the path of a valid Angular project.");
  }
  const isAngularApp = checkForAngularJson(path);
  if (!isAngularApp) {
    throw new Error("Angular project definition could not be found. Please provide the path of a valid Angular project.");
  }
  return isAngularApp;
}

function checkForAngularJson(path: string) {
  try {
    return fs.existsSync(join(path, 'angular.json'))
  } catch (ex) {
    return false;
  }
}

export default checkNgProject;
