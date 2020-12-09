import { isPlatformBrowser } from '@angular/common';
import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
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
  terminalMessage: string;
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
    @Inject(PLATFORM_ID) private platformId: any,
    private upgradeService: UpgradeService
  ) { }

  choosePath() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(e: any) {
    const filePath: string = e.target.files[0]?.path || 'D:/Professional/aritri/src/package.json';
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
      }, err => {
        this.availableVersionsLoading = null;
        this.terminalMessage = this.writeConsole(`<p class="text-danger">${err.error.message}</p>`);
        this.fileSelectError = err.error.message;
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
    this.terminalMessage = null;
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

  copied: boolean;
  copyToClipboard(element: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.getSelection) {
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        this.copied = true;
      }
      window.getSelection().removeAllRanges();
      setTimeout(() => {
        this.copied = false;
      }, 1000);
    }
  }

  clearTerminalOutput() {
    this.terminalMessage = null;
  }

  private writeConsole(value: string) {
    if (this.terminalMessage === undefined || this.terminalMessage === null) {
      this.terminalMessage = '';
    }
    return this.terminalMessage += value;
  }

}
