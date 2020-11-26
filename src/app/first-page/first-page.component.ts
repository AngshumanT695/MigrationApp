import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.less'],
  host: { 'class': 'app-page' }
})
export class FirstPageComponent implements OnInit {

  errorMessage: string;
  selectedDirectory: string

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onFolderSelect(e: any) {
    // const file = e.target.files?.item(0);
    console.log(e);
    this.selectedDirectory = 'something';
    // if (file) {
    //   this.errorMessage = null;
    //   this.selectedDirectory = file.path;
    // } else {
    //   this.errorMessage = 'The selected directory is empty.'
    // }
  }

  onProceed(): void {
    this.router.navigateByUrl('/secondPage');
  }

}
