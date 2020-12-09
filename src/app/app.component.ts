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

  config = new MigrationConfiguration();

  versionSubscription: Subscription;

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
      });
    } else {
      this.fileSelectError = "You have not selected a valid package.json file."
    }
    this.fileSelectForm.reset();
  }

  reset() {
    this.config = new MigrationConfiguration();
    this.versionSubscription?.unsubscribe();
    this.isLoading = null;
  }

  set isLoading(value: string) {
    if (value) {
      this.availableVersionsLoading = APP_CONSTANTS.GET_VERSION_LIST_LOADING;
    } else {
      this.availableVersionsLoading = null;
    }
  }

  get isLoading() {
    return this.availableVersionsLoading;
  }

}
