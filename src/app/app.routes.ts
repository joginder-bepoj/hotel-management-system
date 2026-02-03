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
  {
    path: 'setup',
    loadComponent: () =>
      import('./pages/setup/setup').then((c) => c.SetupComponent),
  },
  {
    path: 'setup/hotel',
    loadComponent: () =>
      import('./pages/setup/hotel/hotel-setup').then((c) => c.HotelSetupComponent),
  },
  {
    path: 'setup/restaurant',
    loadComponent: () =>
      import('./pages/setup/restaurant/restaurant-setup').then((c) => c.RestaurantSetupComponent),
  },
  {
    path: 'setup/apartment',
    loadComponent: () =>
      import('./pages/setup/apartment/apartment-setup').then((c) => c.ApartmentSetupComponent),
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
        path: 'booking',
        children: [
          {
            path: 'add-booking',
            loadComponent: () =>
              import('./pages/booking/add-booking/add-booking').then((c) => c.AddBookingComponent),
          },
          {
            path: 'all-booking',
            loadComponent: () =>
              import('./pages/booking/all-booking/all-booking').then((c) => c.AllBooking),
          },
          {
            path: 'edit-booking/:id',
            loadComponent: () =>
              import('./pages/booking/edit-booking/edit-booking').then((c) => c.EditBookingComponent),
          },
        ]
      },
      {
        path: 'rooms',
        children: [
          {
            path: 'all-rooms',
            loadComponent: () =>
              import('./pages/rooms/all-rooms/all-rooms').then((c) => c.AllRooms),
          },
          {
            path: 'add-room',
            loadComponent: () =>
              import('./pages/rooms/add-room/add-room').then((c) => c.AddRoomComponent),
          },
          {
            path: 'edit-room/:id',
            loadComponent: () =>
              import('./pages/rooms/edit-room/edit-room').then((c) => c.EditRoomComponent),
          },
        ]
      },
    ],
  },
];
