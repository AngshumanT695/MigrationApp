import { runCommand } from '../utilities/runCommand';
import { parseNgUpdateCommand } from './UpdateCmdParser';

import { updateListObjFormat, ngUpdateListFormat } from '../interfaces/interfaces';

export function getUpdateList(pathToAngularProj: string): updateListObjFormat
{
    const output = runCommand('ng', ['update'], { cwd: pathToAngularProj });
    
    if(output.status != 0){
        return { 
            status: false, 
            updateList: null, 
            errorMsg: output.stderr 
        };
    }

    const updateArr: Array<ngUpdateListFormat> = parseNgUpdateCommand(output.stdout);
    
    return { 
        status: true, 
        updateList: updateArr, 
        errorMsg: null 
    };
}
