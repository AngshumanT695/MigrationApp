import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.less']
})
export class FirstPageComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  onBtnOpenClicked(): void {
    this.router.navigateByUrl('/secondPage');
    this.http.get('http://localhost:4200/api//').subscribe(data => console.log(data));
  }

}
