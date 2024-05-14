import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login/services/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  return inject(LoginService).loggedIn() ? true: inject(Router).navigateByUrl('/login');
};
