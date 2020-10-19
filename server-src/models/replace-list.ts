export interface ReplaceList {
  path: string;
  replaceList: Array<ReplaceFormat>;
}

export interface ReplaceFormat {
  name: string;
  'file-types': Array<string>;
  from: string;
  to: string;
}
