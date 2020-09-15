import { breakOutputInLines } from '../utilities/breakIntoLines';

import { dryRunResultFormat } from '../interfaces/interfaces';
import { updateProblems } from '../interfaces/enumerations';
import { CommandResult } from '../../models/command-result';

export function parseError(dryRunOutput: CommandResult): dryRunResultFormat
{
    const outputLines: Array<string> = breakOutputInLines(dryRunOutput.stdout);

    const errorList: Array<{ dependency: string, problem: updateProblems, problemPackage: string, remarks: string}> = [];

    for(const line of outputLines){
        if(/^Package\s+"@*(\w+\/*-*)+"\s+((has a missing peer dependency of)|(has an incompatible peer dependency to))\s+"@*(\w+\/*-*)+"/.test(line)){
            const temp = line.split(/(?:^Package\s+")|(?:"\s+has\s+a(?:n)*\s+)|(?:\s+peer\s+dependency\s+(?:(?:to)|(?:of)))/);
            errorList.push({
                dependency: temp[1],
                problem: temp[2] === 'missing' ? updateProblems.missing: (temp[2] === 'incompatible' ? updateProblems.incompatible : null),
                problemPackage: resolveProblemPackage(temp[2], temp[3]),
                remarks: temp[2] === 'missing' ? null : resolveRemarks(temp[3])
            });
        }
    }

    return {
        status: 1,
        updateList: null,
        errorList: errorList
    };
}

export function parseResult(dryRunOutput: CommandResult): dryRunResultFormat
{
    const outputLines: Array<string> = breakOutputInLines(dryRunOutput.stdout);

    const updateList: Array<{ dependency: string, currentVersion: string, nextVersion: string }> = [];
    for(const line of outputLines){
        if(/^(Updating package.json with dependency\s+)/.test(line)){
            const temp = line.trim().split(/(?:Updating package.json with dependency\s+)|(?:\s+@\s+")|(?:"\s+\(was\s+")|(?:"\)...)/);
            updateList.push({
                dependency: temp[1],
                currentVersion: temp[3],
                nextVersion: temp[2]
            });
        }
    }

    return {
        status: 0,
        updateList: updateList,
        errorList: null
    }
}

function resolveRemarks(lastVar: string): string
{
    const temp = lastVar.trim().split(/(?:"(?:@*(?:\w+\/*-*)+)"\s+\()|(?:\)\.)/);
    return temp[1];
}

function resolveProblemPackage(errorType: string, lastVar: string): string
{
    let errorEnum: updateProblems;
    if(errorType === 'missing')
        errorEnum = updateProblems.missing;
    else if(errorType === 'incompatible')
        errorEnum = updateProblems.incompatible;
    else
        throw `Error type unknown`;

    if(errorEnum == updateProblems.missing){
        const temp = lastVar.trim().split(/(?:^")|(?:"\s+@\s+")|(?:\^|~)|(?:"\.$)/)
        return `${temp[1]}@${temp[3]}`;
    }
    else{
        const temp = lastVar.substring(lastVar.indexOf('"') + 1, lastVar.indexOf('"', lastVar.indexOf('"') + 1));
        return temp;
    }
}
