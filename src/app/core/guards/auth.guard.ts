import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStr = localStorage.getItem('user');
  
  if (userStr) {
    return true;
  }

  // Redirect to login if not authenticated
  console.log('User not authenticated, redirecting to login');
  return router.parseUrl('/authentication/login');
};
