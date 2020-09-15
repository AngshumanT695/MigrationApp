import { updateProblems } from './enumerations';

export interface updateListObjFormat {
  status: boolean,
  updateList: Array<{
    name: string,
    current: string,
    upgradeTo: string,
    upgradeCommand: string
  }>,
  errorMsg: string
}

export interface updateVersionsObjFormat {
  packToUpdateList: Array<any>,
  force: boolean
}

export interface dryRunResultFormat {
  status: number,
  updateList: Array<{
    dependency: string,
    currentVersion: string,
    nextVersion: string
  }>,
  errorList: Array<{
    dependency: string,
    problem: updateProblems,
    problemPackage: string,
    remarks: string
  }>
}

export interface dryRunParseFormat {
  canPerformUpdate: boolean,
  dependencyUpdateMessage: string,
  missingDependency: Array<{
    dependencyName: string,
    message: string
  }>,
  incompatibleDependency: Array<{
    dependency: string,
    problemPackage: string,
    remarks: string
    message: string
  }>
}

export interface gitStatusFormat {
  clean: boolean,
  filesList: string
}

export interface updateLogFormat {
  status: number,
  stdout: string,
  stderr: string
}
