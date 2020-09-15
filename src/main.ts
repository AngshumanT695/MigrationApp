import * as process from 'process';
import * as fs from 'fs';

import { checkNgProj } from './checkProjValidity/checkIfNgProj';
import { getUpdateList } from './updateList/getUpdateList';
import { nodePrompt } from './utilities/nodePrompt';
import { getUpdateVersions } from './updateList/getUpdateVersions';
import { performDryRun } from './dryRun/performDryRun/performDryRun';
import { performForceUpdate } from './performUpdate/forceUpdate/forceUpdate';
import { performUpdate } from './performUpdate/normalUpdate/normalUpdate';
import { parseDryRunOutput } from './dryRun/parseDryRunOutput/parseDryRunOutput';
import { checkGitStatus } from './utilities/checkGitStatus';
import { installDependency } from './performUpdate/installDependencies/installDependency'

import * as interfaces from './interfaces/interfaces';

// Obtain the path of Angular project. Preferably from some GUI
const pathToAngularProj = process.argv.slice(2)[0];

// Check if the project is a valid angular project
let isNgProj: boolean; 

try{
    isNgProj = checkNgProj(pathToAngularProj);
}
catch(err){
    printErrorAndExit(err);
}

if(!isNgProj){
    printErrorAndExit('Error: Not an Angular Project');
}

// Run 'ng update' to get the packages that needs to be updated
const updateListObj: interfaces.updateListObjFormat = getUpdateList(pathToAngularProj);

if(!updateListObj.status){
    printErrorAndExit(updateListObj.errorMsg);
}

// Get the next versions of the package
const updateVersions: Array<interfaces.versionListFormat> = getUpdateVersions(updateListObj.updateList);

// Force update flag
let forceUpdate = false;

const input: string = nodePrompt("Do you want to force the update (Y/n): ");

if(input === 'Y' || input === 'y')
    forceUpdate = true;

const updateVersionsObj: interfaces.updateVersionsObjFormat = {
    packToUpdateList: updateVersions,
    force: forceUpdate
};

fs.writeFileSync('updateVersion.json', JSON.stringify(updateVersionsObj, null, 4), 'utf-8');

const ngVersion: string = nodePrompt('Enter the angular version number: ');

if(forceUpdate){
    console.log("You have decided to use force update. Updating ... ");
    performNgUpdate(pathToAngularProj, ngVersion, forceUpdate);
    printErrorAndExit(null);
}

let flag: string;

do{
    const dryRunOutput: interfaces.dryRunResultFormat = performDryRun(pathToAngularProj, ngVersion);

    const parsedDryRunOutput: interfaces.dryRunParseFormat = parseDryRunOutput(dryRunOutput);

    if(parsedDryRunOutput.canPerformUpdate){
        console.log(parsedDryRunOutput.dependencyUpdateMessage);
        const startUpdate = nodePrompt('\nStart the update (Y/n): ');
        if(startUpdate === 'Y' || startUpdate === 'y'){
            let restart = '';
            do{
                const gitStatus: interfaces.gitStatusFormat = checkGitStatus(pathToAngularProj);
                if(gitStatus.clean){
                    performNgUpdate(pathToAngularProj, ngVersion, forceUpdate);
                    flag = 'E';
                }
                else{
                    console.log(`Your working tree is not clean. Please look at the following files:\n${gitStatus.filesList}`);
                    const proceed = nodePrompt('Continue? (Y/n): ');
                    if(proceed === 'Y' || proceed === 'y'){
                        performNgUpdate(pathToAngularProj, ngVersion, forceUpdate);
                        flag = 'E';
                    }
                }
                if(flag !== 'E') restart = nodePrompt('Press "r" to restart the update. Press any key to exit: ');
            }while(restart === 'r');
        }
    }
    else{
        if(parsedDryRunOutput.incompatibleDependency != null){
            console.log('You have the following incompatible dependencies. Please resolve them.');
            for(const dep of parsedDryRunOutput.incompatibleDependency){
                console.log(dep.message);
            }
        }
        if(parsedDryRunOutput.missingDependency != null){
            console.log('You have the following missing dependencies.');
            for(const dep of parsedDryRunOutput.missingDependency){
                console.log(dep.message);
                const installDep = nodePrompt('Install it now? (Y/n): ');
                if(installDep === 'Y' || installDep === 'y'){
                    const gitStatus: interfaces.gitStatusFormat = checkGitStatus(pathToAngularProj);
                    if(gitStatus.clean){
                        installMissingDependency(dep.dependencyName, pathToAngularProj);
                    }
                    else{
                        console.log(`Your working tree is not clean. Please look at the following files:\n${gitStatus.filesList}`);
                        const proceed = nodePrompt('Continue? (Y/n): ');
                        if(proceed === 'Y' || proceed === 'y'){
                            installMissingDependency(dep.dependencyName, pathToAngularProj);
                        }
                    }
                }
            }
        }
    }
    if(flag !== 'E') flag = nodePrompt('Press "e" to exit app. Press any key to retry: ');
    else console.log('Updates performed. Exiting..')
}while(flag !== 'E' && flag !== 'e');

function installMissingDependency(dependencyName: string, pathToNgProj: string): void
{
    const status = installDependency(dependencyName, pathToNgProj);
    if(!status)
        console.log(`Could not install ${dependencyName}`);
}

function performNgUpdate(pathToAngularProj: string, version: string, forceUpdate: boolean): void
{
    if(forceUpdate)
        performForceUpdate(pathToAngularProj, version);
    else 
        performUpdate(pathToAngularProj, version);
}

function printErrorAndExit(errorMessage: string): void{
    if(errorMessage != null)
        console.log(errorMessage);
    process.exit();
}
