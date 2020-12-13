import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from './app-constants';
import { MigrationConfiguration, UpdateRequest } from './models/configuration';
import { UpgradeService } from './services/upgrade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  availableVersions: Array<string>;
  advanceOptions: any;
  upgradeList: Array<any>;

  terminalMessage: string;
  onFileSelectError: string;
  onVersionSelectError: string;

  availableVersionsLoading: string;
  advanceOptionsLoading: string;

  config = new MigrationConfiguration();

  versionSubscription: Subscription;
  advanceOptionsSubscription: Subscription;

  @ViewChild('fileSelectForm') fileSelectForm: NgForm;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLElement>;

  constructor(
    private upgradeService: UpgradeService
  ) { }

  choosePath() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(e: any) {
    const filePath: string = e.target.files[0]?.path || 'D:/Professional/aritri/package.json';
    this.onFileSelectError = null;
    if (filePath?.indexOf('package.json') >= 0) {
      const lastSlashIndex = filePath.replace(/\\/g, '/').lastIndexOf('/');
      this.config.projectPath = filePath.substring(0, lastSlashIndex);

      this.availableVersionsLoading = APP_CONSTANTS.GET_VERSION_LIST_LOADING;

      this.versionSubscription = this.upgradeService.getUpdateList(this.config.projectPath).subscribe(data => {
        this.availableVersionsLoading = null;
        this.upgradeList = data;
        const angularCore = data.filter(d => d.name === '@angular/core')[0];
        this.config.currentVersion = angularCore.current;
        this.availableVersions = angularCore.versions;
        this.config.targetVersion = this.availableVersions[0];
        this.onSelectTargetVersion();
      }, err => {
        this.availableVersionsLoading = null;
        this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
        this.onFileSelectError = err.error.message;
      });
    } else {
      this.onFileSelectError = "You have not selected a valid package.json file."
    }
    this.fileSelectForm.reset();
  }

  onSelectTargetVersion() {
    this.onVersionSelectError = null;
    this.advanceOptionsLoading = APP_CONSTANTS.GET_ADVANCE_OPTIONS_LOADING;
    this.advanceOptionsSubscription =
      this.upgradeService.getChangesList(this.config.currentVersion, this.config.targetVersion)
        .subscribe((response: any) => {
          this.advanceOptionsLoading = null;
          this.advanceOptions = response;
          this.config.beforeChanges = this.advanceOptions?.beforeUpdate;
          this.config.afterChanges = this.advanceOptions?.afterUpdate;
        }, err => {
          this.advanceOptionsLoading = null;
          this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
          this.onVersionSelectError = err.error.message;
        });
  }

  onFlagChange(source: string) {
    if (source === 'dryRun' && this.config.dryRun) {
      this.config.force = false;
    } else if (source === 'force' && this.config.force) {
      this.config.dryRun = false;
    }
  }

  beforeUpgradeListCompareWith = (o1: any, o2: any) => o1.name === o2.name;

  reset() {
    this.config = new MigrationConfiguration();
    this.advanceOptionsSubscription?.unsubscribe();
    this.versionSubscription?.unsubscribe();
    this.resetLoaders();
    this.resetErrors();
  }

  run() {
    if (this.config.dryRun) {
      const updateRequest: UpdateRequest = { path: this.config.projectPath, packages: this.updatePackageVersions() };
      this.upgradeService.dryRun(updateRequest).subscribe((response: any) => {
        this.writeConsole(JSON.stringify(response));
      });
    } else {
      const updateRequest: UpdateRequest = { path: this.config.projectPath, packages: this.updatePackageVersions(), force: this.config.force };
      this.upgradeService.upgrade(updateRequest).subscribe((response: any) => {
        this.writeConsole(JSON.stringify(response));
      });
    }

  }

  resetErrors() {
    this.onFileSelectError = undefined;
    this.onVersionSelectError = undefined;
  }

  resetLoaders() {
    this.availableVersionsLoading = undefined;
    this.advanceOptionsLoading = undefined;
  }

  get isLoading() {
    return this.advanceOptionsLoading || this.availableVersionsLoading;
  }

  private writeConsole(value: string) {
    if (this.terminalMessage === undefined || this.terminalMessage === null) {
      this.terminalMessage = '';
    }
    return this.terminalMessage += value;
  }

  private updatePackageVersions() {
    let updateList = this.upgradeList.map(item => {
      let i;
      for (i = 0; i < item.versions.length; i++) {
        if (!item.versions[i].includes('beta')) {
          let itemMajor = item.versions[i].split('.')[0],
            itemMinor = item.versions[i].split('.')[1],
            targetMajor = this.config.targetVersion.split('.')[0],
            targetMinor = this.config.targetVersion.split('.')[1],
            updateToMajor = item.upgradeTo.split('.')[0];
          if (item.versions[i] === this.config.targetVersion) {
            item.upgradeTo = this.config.targetVersion;
            break;
          } else {
            if (itemMajor === targetMajor) {
              if (itemMinor === targetMinor) {
                item.upgradeTo = item.versions[i];
              } else {
                if (updateToMajor === targetMajor && item.upgradeTo.split('.')[1] != targetMinor) {
                  item.upgradeTo = item.versions[i];
                }
              }
            } else if (targetMajor !== updateToMajor) {
              if (itemMajor < targetMajor && targetMajor > updateToMajor) {
                item.upgradeTo = item.versions[i];
              }
            }
          }
        }
      }
      return item;
    });
    return updateList;
  }

}
