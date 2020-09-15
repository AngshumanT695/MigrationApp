import { PackageInfo } from './package-info';

export interface UpdateRequest {
  path?: string,
  packages?: Array<PackageInfo>,
  force?: boolean
}
