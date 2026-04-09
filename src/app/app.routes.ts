import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'events', loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent) },
  { path: 'events/:id', loadComponent: () => import('./features/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  { path: 'checkout/:id', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'account', loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
  { path: '**', redirectTo: '' }
];
