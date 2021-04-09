import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService: UsuarioService,
              private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const res = this.usuarioService.validateToken().toPromise();
    res.then(auth => {
      if(!auth){
        this.router.navigateByUrl('/login');
      }   
    })
    return res;
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const res = this.usuarioService.validateToken().toPromise();
    res.then(auth => {
      if(!auth){
        this.router.navigateByUrl('/login');
      }   
    })
    return res;
  }
  
}
