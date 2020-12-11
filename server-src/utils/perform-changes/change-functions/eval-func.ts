import resolveHttp from './res-http-module/res-http-json';

function evaluateFunctionName(functionName: string, path: string): Array<string> {
  let returnVal: Array<string>;

  switch (functionName) {
    case 'resolveHttp':
      returnVal = resolveHttp(path);
      break;
    default:
      throw new Error('Unknown function called');
  }

  return returnVal;
}

export default evaluateFunctionName;
