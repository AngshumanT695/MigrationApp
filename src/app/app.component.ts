import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from './app-constants';
import { MigrationConfiguration, UpdateRequest, ChangesFormat } from './models/configuration';
import { UpgradeService } from './services/upgrade.service';
import { MatSelectionList, MatListOption } from '@angular/material/list';


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
  runLoading: string;

  config = new MigrationConfiguration();

  versionSubscription: Subscription;
  advanceOptionsSubscription: Subscription;

  @ViewChild('fileSelectForm') fileSelectForm: NgForm;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLElement>;
  @ViewChild('beforeUpdateOptions') beforeUpdateOptions: MatSelectionList;
  @ViewChild('afterUpdateOptions') afterUpdateOptions: MatSelectionList;

  constructor(
    private upgradeService: UpgradeService
  ) { }

  choosePath() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(e: any) {
    const filePath: string = e.target.files[0]?.path || '/home/angshuman/Development/Web/Angular/Migration_OfficePOC/env_ng_6/Test-ng6-Sample/package.json';
    this.onFileSelectError = null;
    if (filePath?.indexOf('package.json') >= 0) {
      const lastSlashIndex = filePath.replace(/\\/g, '/').lastIndexOf('/');
      this.config.projectPath = filePath.substring(0, lastSlashIndex);

      this.availableVersionsLoading = APP_CONSTANTS.GET_VERSION_LIST_LOADING;

      this.versionSubscription = this.upgradeService.getUpdateList(this.config.projectPath, true).subscribe(data => {
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
      this.upgradeService.getChangesList(this.config.currentVersion, this.config.targetVersion, false)
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
      this.runLoading = APP_CONSTANTS.DRY_RUN_LOADING;
      this.upgradeService.dryRun(updateRequest, true).subscribe((response: any) => {
        this.runLoading = null;
        if (response.status === 0) {
          this.terminalMessage = this.writeConsole(
            `<div class="text-success">
              <h3>The Angular Project can be upgraded successfully!</h3>
              ${response.stdout?.replace(/\n/g, '<br>') || response.stderr?.replace(/\n/g, '<br>')}
            </div>`);
        } else {
          this.terminalMessage = this.writeConsole(
            `<div class="text-warn">
              <h3>Your project has incompatible packages. Please try a FORCE UPDATE!</h3>
              ${response.stdout?.replace(/\n/g, '<br>') || response.stderr?.replace(/\n/g, '<br>')}
            </div>`);
        }
      }, err => {
        this.runLoading = null;
        this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
      });
    } else {
      this.runLoading = APP_CONSTANTS.RUN_LOADING;
      const beforeUpdateOptions: Array<string> = this.beforeUpdateOptions.selectedOptions.selected.map((item: MatListOption) => item.value.id);
      const beforeUpdateAdvanceOptionRequest: ChangesFormat = { path: this.config.projectPath, to: this.config.targetVersion, from: this.config.currentVersion, changes: beforeUpdateOptions };
      if (this.config.force) {
        this.terminalMessage = this.writeConsole(`<p class="text-warn">WARNING: You are using the FORCE flag. Hope you know what you are doing.</p>`);
      }
      this.upgradeService.performAdvanceOptionChanges(beforeUpdateAdvanceOptionRequest)
        .subscribe(response => {
          this.terminalMessage = this.writeConsole(`<p class="text-success">STAGE 1: Before update operations completed.</p>`);
          const updateRequest: UpdateRequest = { path: this.config.projectPath, packages: this.updatePackageVersions(), force: this.config.force };
          this.upgradeService.upgrade(updateRequest)
            .subscribe((response: any) => {
              this.terminalMessage = this.writeConsole(`<p class="text-success">STAGE 2: ${response.message}</p>`);
              const afterUpdateOptions: Array<string> = this.afterUpdateOptions.selectedOptions.selected.map((item: any) => item.value.id);
              const afterUpdateAdvanceOptionRequest: ChangesFormat = { path: this.config.projectPath, to: this.config.targetVersion, from: this.config.currentVersion, changes: afterUpdateOptions };
              this.upgradeService.performAdvanceOptionChanges(afterUpdateAdvanceOptionRequest)
                .subscribe(response => {
                  this.runLoading = null;
                  this.terminalMessage = this.writeConsole(`
                    <div class="text-success mb-3">
                      STAGE 3: After update operations completed.
                      <br>
                      Your Angular project was updated successfully to ${this.config.targetVersion}!
                    </div>`);
                }, err => {
                  this.runLoading = null;
                  this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
                })
            }, err => {
              this.runLoading = null;
              this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
            })
        }, err => {
          this.runLoading = null;
          this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
        })
    }
  }

  resetErrors() {
    this.onFileSelectError = undefined;
    this.onVersionSelectError = undefined;
  }

  resetLoaders() {
    this.availableVersionsLoading = undefined;
    this.advanceOptionsLoading = undefined;
    this.runLoading = undefined;
  }

  get isLoading() {
    return this.runLoading || this.advanceOptionsLoading || this.availableVersionsLoading;
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
