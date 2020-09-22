export interface PackageInfo {
  name?: string;
  current?: string;
  upgradeTo?: string;
  upgradeCommand?: string;
  versions?: Array<string>;
}
