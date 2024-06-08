import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn,  Router,  RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const isAuth = authService.getIsAuth();
    if (!isAuth) {
      router.navigate(['/login']);
    }
    return isAuth;
  };