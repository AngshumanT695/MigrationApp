import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PackageInfo } from '../models/configuration';

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
}
