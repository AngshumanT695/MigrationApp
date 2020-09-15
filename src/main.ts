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
            const gitStatus: interfaces.gitStatusFormat = checkGitStatus(pathToAngularProj);
            let cleanFlag: string;
            if(!gitStatus.clean){
                console.log(`Your working tree is not clean. Please look at the following files:\n${gitStatus.filesList}`);
                cleanFlag = nodePrompt('Proceed (Y/n): ');
            }
            if(cleanFlag === 'Y' || cleanFlag === 'y'){
                for(const dep of parsedDryRunOutput.missingDependency){
                    console.log(dep.message);
                    const installDep = nodePrompt('Install it now? (Y/n): ');
                    if(installDep === 'Y' || installDep === 'y'){
                        installMissingDependency(dep.dependencyName, pathToAngularProj);
                    }
                }
            }
        }
    }
    if(flag !== 'E') flag = nodePrompt('Press "e" to exit app. Press any key to retry: ');
}while(flag !== 'E' && flag !== 'e');

function installMissingDependency(dependencyName: string, pathToNgProj: string): void
{
    const installStatus: interfaces.updateLogFormat = installDependency(dependencyName, pathToNgProj);
    if(installStatus.status == 0)
        console.log(`Installed ${dependencyName}.`);
    else if(installStatus.status == 1){
        const errMsg = '' + installStatus.stdout == undefined ? '' : installStatus.stdout + installStatus.stderr == undefined ? '' : installStatus.stderr;
        console.log(`Couldn't Update ${dependencyName}. Please find the error messages below:`);
        console.log(errMsg);
    }
}

function performNgUpdate(pathToAngularProj: string, version: string, forceUpdate: boolean): void
{
    let updateOutput: interfaces.updateLogFormat;
    if(forceUpdate)
        updateOutput = performForceUpdate(pathToAngularProj, version);
    else 
        updateOutput = performUpdate(pathToAngularProj, version);

    if(updateOutput.status == 0){
        console.log('Updated angular successfully. Update log saved as "Angular_Update_Log.txt."');
        fs.writeFileSync('Angular_Update_Log.txt', updateOutput.stdout, 'utf-8');
    }
    else if(updateOutput.status == 1){
        console.log(`Update couldn't be performed. Error saved to "Angular_Update_Error_Log.txt".`);
        const errMsg = '' + updateOutput.stdout == undefined ? '' : updateOutput.stdout + updateOutput.stderr == undefined ? '' : updateOutput.stderr;
        fs.writeFileSync('Angular_Update_Error_Log.txt', errMsg, 'utf-8');
    }
}

function printErrorAndExit(errorMessage: string): void{
    if(errorMessage != null)
        console.log(errorMessage);
    process.exit();
}
