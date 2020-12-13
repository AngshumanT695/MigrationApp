import * as fs from 'fs';
import { join } from 'path';

const checkForAngularJson = (path: string) => {
  return new Promise<boolean>((resolve, reject) => {
    fs.stat(join(path, 'angular.json'), (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  });
}
const checkNgProject = async (path: string) => {
  if (!path) {
    throw new Error("The provided path is invalid. Please provide the path of a valid Angular project.");
  }
  const isAngularApp = await checkForAngularJson(path);
  if (!isAngularApp) {
    throw new Error("Angular project definition could not be found. Please provide the path of a valid Angular project.");
  }
  return isAngularApp;
}


export default checkNgProject;
