import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsersList } from '../interfaces/userList.interface';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  auth2: any;
  usuario: Usuario;

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

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role(): 'ADMIN_ROLE'|'USER_ROLE'{
    return this.usuario.role;
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validateToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers)
    .pipe(
      map( (res:any) => {
        const {
          email,
          google,
          img = '',
          nombre,
          role,
          uid
        } = res.usuario;

        this.usuario =  new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarData(res.token, res.menu)
        return true;
      }),
      catchError(err => of(false))
    );
  }

  //Edits the actual user
  putUser(data: {email: string, nombre: string}){
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data, this.headers)
  }

  //Edits any user
  putFullUser(user: Usuario){
    return this.http.put(`${base_url}/usuarios/${user.uid}`, user, this.headers)
  }

  createUser(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap( (res: any) => {
          this.guardarData(res.token, res.menu)
        })
      );
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap( (res: any) => {
          this.guardarData(res.token, res.menu)
        })
      );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap( (res: any) => {
          this.guardarData(res.jwt, res.menu)      
         })
      );
  }

  getUsers(start: number){
    return this.http.get<UsersList>(`${base_url}/usuarios?desde=${start}`, this.headers)
              .pipe(
                map( res => {
                  const usuarios = res.usuarios.map(
                    user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                  );

                  return {
                    total: res.total,
                    usuarios
                  };
                })
              );
  }

  deleteUser(user: Usuario){
    return this.http.delete(`${base_url}/usuarios/${user.uid}`, this.headers);
  }

  guardarData(token: string, menu: any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
}
