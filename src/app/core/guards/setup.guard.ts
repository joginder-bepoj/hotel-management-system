import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HotelService } from '../services/hotel.service';

export const setupGuard: CanActivateFn = (route, state) => {
  const hotelService = inject(HotelService);
  const router = inject(Router);

  // Check if hotel setup is complete
  if (hotelService.isSetupComplete()) {
    return true;
  }

  // Allow navigation to setup routes
  if (state.url.startsWith('/setup')) {
    return true;
  }

  // If no hotel is set up, redirect to setup page
  console.log('No hotel setup found, redirecting to /setup');
  return router.parseUrl('/setup');
};
