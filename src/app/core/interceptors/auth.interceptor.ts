import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Enable credentials on ALL requests
  // This allows the server to SET cookies during login
  // And allows the browser to SEND cookies during add-hotel
  const clonedReq = req.clone({
    withCredentials: true,
    setHeaders: {
      'Accept': 'application/json'
    }
  });

  return next(clonedReq);
};
