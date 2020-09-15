import { dryRunResultFormat, dryRunParseFormat } from '../interfaces/interfaces';
import { updateProblems } from '../interfaces/enumerations';

export function parseDryRunOutput(dryRunOutput: dryRunResultFormat): dryRunParseFormat
{
    let output: dryRunParseFormat;
    if(dryRunOutput.status == 0)
        output = parseForNoError(dryRunOutput);
    else if(dryRunOutput.status == 1)
        output = parseForError(dryRunOutput);

    return output;
}

function parseForError(dryRunOutput: dryRunResultFormat): dryRunParseFormat
{
    const missingDependency: Array<{
        dependencyName: string, message: string
    }> = [];
    const incompatibleDependency: Array<{
        dependency: string,
        problemPackage: string,
        remarks: string,
        message: string
    }> = [];

    for(const item of dryRunOutput.errorList){
        if(item.problem == updateProblems.missing){
            let found = false;
            for(const dep of missingDependency){
                if(dep.dependencyName == item.problemPackage){
                    found = true; break;
                }
            }

            if(!found){
                missingDependency.push({
                    dependencyName: item.problemPackage,
                    message: `${item.problemPackage} is required to be installed.`
                });
            }
        }
        else if(item.problem == updateProblems.incompatible){
            incompatibleDependency.push({
                    dependency: item.dependency,
                    problemPackage: item.problemPackage,
                    remarks: item.remarks,
                    message: `Package ${item.dependency} has an incompatible dependency to ${item.problemPackage} (${item.remarks})`
            });
        }
    }

    const result: dryRunParseFormat = {
        canPerformUpdate: false,
        dependencyUpdateMessage: null,
        missingDependency: missingDependency.length == 0 ? null : missingDependency,
        incompatibleDependency: incompatibleDependency.length == 0 ? null : incompatibleDependency
    };

    return result;
}

function parseForNoError(dryRunOutput: dryRunResultFormat): dryRunParseFormat
{
    let updateMessage = 'We will be updating:';

    for(let i = 0; i < dryRunOutput.updateList.length; ++i){
        const item = dryRunOutput.updateList[i];
        updateMessage += `\n${i+1}. ${item.dependency} from version ${item.currentVersion} to ${item.nextVersion}`
    }

    const result: dryRunParseFormat = {
        canPerformUpdate: true,
        dependencyUpdateMessage: updateMessage,
        missingDependency: null,
        incompatibleDependency: null
    };

    return result
}
