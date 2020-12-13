export class MigrationConfiguration {
  constructor(
    public projectPath?: string,
    public currentVersion?: string,
    public targetVersion?: string,
    public dryRun?: boolean,
    public force?: boolean,
    public beforeChanges?: Array<any>,
    public afterChanges?: Array<any>
  ) { }
}

export interface PackageInfo {
  name?: string;
  current?: string;
  upgradeTo?: string;
  upgradeCommand?: string;
  versions?: Array<string>;
}

export interface UpdateRequest {
  path?: string;
  packages?: Array<PackageInfo>;
  force?: boolean;
}

export interface ChangesFormat {
  path: string;
  from: string;
  to: string;
  changes: Array<string>;
}
