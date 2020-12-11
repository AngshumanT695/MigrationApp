export class MigrationConfiguration {
  constructor(
    public projectPath?: string,
    public currentVersion?: string,
    public targetVersion?: string,
    public dryRun?: boolean,
    public force?: boolean,
    public beforeChanges?: Array<any>
  ) { }
}

export interface PackageInfo {
  name?: string;
  current?: string;
  upgradeTo?: string;
  upgradeCommand?: string;
  versions?: Array<string>;
}
