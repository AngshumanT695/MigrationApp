import runShellCommand from './run-shell-command';

function unInstallNodePackage(packageName: Array<string>, projectPath: string)
{
    if (packageName === null){
        throw new Error('Package name not found');
    }
    const output = runShellCommand('npm', ['uninstall', ...packageName], { cwd: projectPath });
    if (output.status !== 0){
        throw new Error('Package could not be un-installed.');
    }

    return { uninstalled: packageName };
}

export default unInstallNodePackage;
