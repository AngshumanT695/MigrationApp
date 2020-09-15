import { runCommand } from '../../utilities/runCommand';

export function installDependency(dependencyName: string, pathToNgProj: string): boolean
{
    const output = runCommand('npm', ['install', dependencyName], { cwd: pathToNgProj });
    
    return output.status === 0;
}
