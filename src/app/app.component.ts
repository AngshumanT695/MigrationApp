import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { routerAnimations } from './app-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [routerAnimations]
})
export class AppComponent {

  isFirstPage: Observable<boolean>;
  version: string;
  dryRunFlagDisabled: boolean;
  forceRunFlagDisabled: boolean;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private router: Router
  ) {
    this.isFirstPage = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.url === '/'),
      distinctUntilChanged()
    );
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animationKey;
  }

  choosePath() {
    this.fileInput.nativeElement.click();
  }

  onFileSelect(e) {
    console.log(e);
    //this.selectedDirectory = 'something';
  }

}
