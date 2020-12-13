import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PackageInfo, UpdateRequest } from '../models/configuration';
import { ChangesFormat } from 'server-src/models/change-list';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {

  constructor(
    private http: HttpClient
  ) { }

  getUpdateList(projectPath: string) {
    return this.http.post<Array<PackageInfo>>('/api/get-upgrade-list', { path: projectPath });
  }

  getChangesList(from: string, to: string) {
    return this.http.post('/api/changes-list', { from: from, to: to });
  }

  upgrade(upgradeParams: UpdateRequest) {
    upgradeParams.force = true;
    return this.http.post<{ message: string }>('/api/upgrade', upgradeParams);
  }

  dryRun(upgradeParams: UpdateRequest) {
    return this.http.post('/api/upgrade-dry', upgradeParams);
  }

  performAdvanceOptionChanges(advanceOptions: ChangesFormat) {
    return this.http.post('/api/perform-changes', advanceOptions);
  }
}
