import runShellCommand from './run-shell-command';

function unInstallNodePackage(packageName: string, projectPath: string)
{
    if (packageName === null){
        throw new Error('Package name not found');
    }
    const output = runShellCommand('npm', ['uninstall', packageName], { cwd: projectPath });
    if (output.status !== 0){
        throw new Error('Package could not be un-installed.');
    }

    return { Message: `${packageName} has been un-installed` };
}

export default unInstallNodePackage;
