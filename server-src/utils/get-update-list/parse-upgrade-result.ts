import { breakOutputInLines } from '../utilities/breakIntoLines';
import { PackageInfo } from '../../models/package-info';

function parseNgUpdateResult(cmdOutput: string) {
  const cmdOutputLines = breakOutputInLines(cmdOutput);
  const cmdFilteredLines = filterOutputLines(cmdOutputLines);
  const packageArr = parseArray(cmdFilteredLines);

  return packageArr;
}

function parseArray(cmdFilteredLines: Array<string>) {
  const arr: Array<PackageInfo> = [];

  for (const line of cmdFilteredLines) {
    const elements = line.split(/\s{2,}|\s+(?:->)\s+/);
    arr.push({
      name: elements[0],
      current: elements[1],
      upgradeTo: elements[2],
      upgradeCommand: elements[3]
    });
  }

  return arr;
}

function filterOutputLines(cmdOutputLines: Array<string>): Array<string> {
  const arr: Array<string> = [];

  for (let i = 0; i < cmdOutputLines.length; ++i) {
    if (/^Name\s+Version\s+(Command to update)$/.test(cmdOutputLines[i])) {
      if (/^(-)+$/.test(cmdOutputLines[++i])) {
        while (++i < cmdOutputLines.length && /^\w+|@\s*(\d?.)+(\s+(->)\s+)(\d?.)+\s*(\w|@)+$/.test(cmdOutputLines[i])) {
          arr.push(cmdOutputLines[i]);
        }
      }
    }
  }

  return arr;
}

export default parseNgUpdateResult;
