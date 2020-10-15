export interface ReplaceList {
  path: string;
  changes: Array<ChangesFormat>;
}

export interface ChangesFormat {
  name: string;
  'file-types': Array<string>;
  from: string;
  to: string;
}
