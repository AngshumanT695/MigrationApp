import { trigger, transition, style, animateChild, animate, query, group } from '@angular/animations';

export const forwardSlide = [
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    })
  ], { optional: true }),
  query(':enter', [
    style({ transform: 'translateX(100%)' })
  ], { optional: true }),
  query(':leave', animateChild(), { optional: true }),
  group([
    query(':leave', [
      animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
    ], { optional: true })
  ]),
  query(':enter', animateChild(), { optional: true }),
];

export const backwardSlide = [
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    })
  ], { optional: true }),
  query(':enter', [
    style({ transform: 'translateX(-100%)' })
  ], { optional: true }),
  query(':leave', animateChild(), { optional: true }),
  group([
    query(':leave', [
      animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
    ], { optional: true })
  ]),
  query(':enter', animateChild(), { optional: true }),
];


export const routerAnimations =
  trigger('routeAnimations', [
    transition('firstPage => *', forwardSlide),
    transition('* => firstPage', backwardSlide),

    transition('secondPage => *', forwardSlide),
    transition('* => secondPage', backwardSlide),
  ]);
