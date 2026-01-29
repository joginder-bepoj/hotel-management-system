import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: 'authentication/login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((c) => c.LoginComponent),
  },
  {
    path: 'authentication/signup',
    loadComponent: () =>
      import('./pages/auth/signup/signup').then((c) => c.SignupComponent),
  },
  { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((c) => c.DashboardComponent),
      },
      {
        path: 'booking/add-booking',
        loadComponent: () =>
          import('./pages/booking/add-booking/add-booking').then((c) => c.AddBookingComponent),
      },
      {
        path: 'booking/all-booking',
        loadComponent: () =>
          import('./pages/booking/all-booking/all-booking').then((c) => c.AllBooking),
      },
    ],
  },
];
