import runShellCommand from './run-shell-command';

function installNodePackage(packageName: string, projectPath: string)
{
    if (packageName === null){
        throw new Error('Package name not found');
    }
    const output = runShellCommand('npm', ['install', packageName], { cwd: projectPath });
    if (output.status !== 0){
        throw new Error('Package could not be installed.');
    }

    return { Message: `${packageName} has been installed` };
}

export default installNodePackage;
