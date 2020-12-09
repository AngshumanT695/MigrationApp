import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  version = '';
  @ViewChild('fileInput') fileInput: ElementRef<HTMLElement>;

  choosePath() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(e) {
    console.log(e);
    //this.selectedDirectory = 'something';
  }

}
