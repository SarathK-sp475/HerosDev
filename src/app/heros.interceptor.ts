import { HttpInterceptorFn } from '@angular/common/http';

export const herosInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('logintoken')
  const newCloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  return next(newCloneRequest);
};
