import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'];

    if (this.authService.isLoggedIn()) {
      const userRoles = this.authService.getUserRoles();
      if (userRoles && expectedRoles.some((role: string) => userRoles.includes(role))) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
