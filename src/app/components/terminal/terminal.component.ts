import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent {

  @Input() message: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

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
    this.message = null;
  }

}
