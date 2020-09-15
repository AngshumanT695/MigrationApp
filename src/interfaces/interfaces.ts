import { updateProblems } from './enumerations';

export interface cmdOutputFormat{
    pid: number,
    status: number | null,
    signal: number | null,
    stdout: string,
    stderr: string,
    error: Error
}

export interface updateListObjFormat{
    status: boolean,
    updateList: Array<{ 
        name: string, 
        current: string, 
        upgradeTo: string, 
        upgradeCommand: string 
    }>,
    errorMsg: string
}

export interface ngUpdateListFormat{
    name: string,
    current: string,
    upgradeTo: string,
    upgradeCommand: string 
}

export interface versionListFormat{
    name: string,
    currentVersion: string,
    upgradeTo: string,
    'next-dist-tags': Array<string>,
    upgradeCommand: string
}

export interface updateVersionsObjFormat{
    packToUpdateList: Array<versionListFormat>,
    force: boolean
}

export interface dryRunResultFormat{
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

export interface dryRunParseFormat{
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

export interface gitStatusFormat{
    clean: boolean,
    filesList: string
}

export interface updateLogFormat{
    status: number,
    stdout: string,
    stderr: string
}
