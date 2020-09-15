import * as fs from 'fs';

export function checkNgProj(filePath: string): boolean
{
    const fileList: Array<string> = [];
    
    fs.readdirSync(filePath).forEach(file => {
        fileList.push(file);
    })
     
    if(fileList.includes('angular.json'))
        return true;
    
    return false;
}
