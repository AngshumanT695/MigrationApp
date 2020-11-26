import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.less'],
  host: { 'class': 'app-page' }
})
export class SecondPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBtnResetClicked(): void {
    this.router.navigateByUrl('/firstPage');
  }

}
