import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
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

}
