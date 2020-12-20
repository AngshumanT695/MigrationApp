import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { PackageInfo, UpdateRequest } from '../models/configuration';
import { ChangesFormat } from 'server-src/models/change-list';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {

  constructor(
    private http: HttpClient
  ) { }

  getUpdateList(projectPath: string, mock: boolean) {
    if (mock) {
      return this.http.get<Array<PackageInfo>>('/assets/get-upgrade-list.json').pipe(delay(7500));
    } else {
      return this.http.post<Array<PackageInfo>>('/api/get-upgrade-list', { path: projectPath });
    }
  }

  getChangesList(from: string, to: string, mock: boolean) {
    if (mock) {
      return this.http.get('/assets/changes-list.json').pipe(delay(4000));;
    } else {
      return this.http.post('/api/changes-list', { from: from, to: to });
    }
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
