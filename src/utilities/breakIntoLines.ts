export function breakOutputInLines(cmdOutput: string): Array<string>
{
    const arr: Array<string> = [];

    for(let i = 0; i < cmdOutput.length; )
    {
        const pos: number = cmdOutput.indexOf('\n', i);
        arr.push(cmdOutput.substring(i, pos).trim());
        i = pos + 1;
    }

    return arr;
}
