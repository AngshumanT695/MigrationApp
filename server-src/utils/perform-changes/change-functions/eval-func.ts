import resolveHttp from './res-http-module/res-http-json';

function evaluateFunctionName(functionName: string, path: string): string {
  let returnVal: string;

  switch (functionName) {
    case 'resolveHttp':
      const output = resolveHttp(path);
      returnVal = `${output.length} files changed.`;
      break;
    default:
      throw new Error('Unknown function called');
  }

  return returnVal;
}

export default evaluateFunctionName;
