export interface ChangesFormat {
  path: string;
  from: string;
  to: string;
  changes: Array<string>;
}

export interface ReplaceFormat {
  fileTypes: Array<string>;
  from: string | Array<string>;
  to: string | Array<string>;
}

export interface ChangesReturnFormat {
  id: string;
  operations: Array<{
    changeType: string;
    value: Array<string>;
  }>;
}
