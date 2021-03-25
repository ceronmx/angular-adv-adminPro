import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.initGoogle();
  }

  get token(){
    return localStorage.getItem('token') || '';
  }

  get uid(){
    return this.usuario.uid || '';
  }



  initGoogle(){
    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '455877504568-5d4oqes7q7j921ectbiln6blrkbe4rs9.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })
  }

  public logout() {
    localStorage.removeItem('token');
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  public validateToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (res:any) => {
        const {
          email,
          google,
          img = '',
          nombre,
          rol,
          uid
        } = res.usuario;

        this.usuario =  new Usuario(nombre, email, '', img, google, rol, uid);
        localStorage.setItem('token', res.token);
        return true;
      }),
      catchError(err => of(false))
    );
  }


  public putUser(data: {email: string, nombre: string}){
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,{
      headers: {
        'x-token': this.token
      }
    })
  }

  public createUser(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap( (res: any) => {
          localStorage.setItem('token', res.token);
        })
      );
  }


  public login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap( (res: any) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  public loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap( (res: any) => {
          localStorage.setItem('token', res.jwt);
        })
      );
  }
}
