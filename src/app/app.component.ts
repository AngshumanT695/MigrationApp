import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from './app-constants';
import { MigrationConfiguration } from './models/configuration';
import { UpgradeService } from './services/upgrade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  availableVersions = [];
  fileSelectError: string;
  availableVersionsLoading: string;
  advanceOptionsLoading: string;

  config = new MigrationConfiguration();
  advanceOptionsList: Array<any>;

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
    if (filePath?.indexOf('package.json') >= 0) {
      this.fileSelectError = null;
      const lastSlashIndex = filePath.replace('\\', '/').lastIndexOf('/');
      this.config.projectPath = filePath.substring(0, lastSlashIndex);

      this.availableVersionsLoading = APP_CONSTANTS.GET_VERSION_LIST_LOADING;

      this.versionSubscription = this.upgradeService.getUpdateList(this.config.projectPath).subscribe(data => {
        this.availableVersionsLoading = null;
        const angularCore = data.filter(d => d.name === '@angular/core')[0];

        this.config.currentVersion = angularCore.current;
        this.availableVersions = angularCore.versions;
        this.config.targetVersion = this.availableVersions[0];

        this.onSelectTargetVersion();
        this.advanceOptionsSubscription = this.upgradeService.getChangesList(this.config.currentVersion, this.config.targetVersion).subscribe((response: any) => {
          this.advanceOptionsLoading = null;
          this.advanceOptionsList = response?.changes;
        })
      });
    } else {
      this.fileSelectError = "You have not selected a valid package.json file."
    }
    this.fileSelectForm.reset();
  }

  onSelectTargetVersion() {
    this.advanceOptionsLoading = APP_CONSTANTS.GET_ADVANCE_OPTIONS_LOADING;
  }

  reset() {
    this.config = new MigrationConfiguration();
    this.advanceOptionsSubscription?.unsubscribe();
    this.versionSubscription?.unsubscribe();
    this.resetLoaders();
  }

  resetLoaders() {
    this.availableVersionsLoading = null;
    this.advanceOptionsLoading = null;
  }

  get isLoading() {
    return this.advanceOptionsLoading || this.availableVersionsLoading;
  }

}
