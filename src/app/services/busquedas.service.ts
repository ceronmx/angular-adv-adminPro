import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(){
    return localStorage.getItem('token');
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private toArreglodeUsuarios(array: any[]): Usuario[]{
    return array.map(
      user => new Usuario(user.nombre, user.email, null, user.img, user.google, user.role, user.uid)
    );
  }

  buscar(tipo: 'medicos'|'usuarios'|'hospitales',
         termino: string = ''){
          return this.http.get<any[]>(`${base_url}/todo/coleccion/${tipo}/${termino}`, this.headers)
            .pipe(
              map( (res: any) => {
                switch(tipo){
                  case 'usuarios':
                    return this.toArreglodeUsuarios(res.data);
                  case 'medicos':
                    break;
                  case 'hospitales':
                    break;

                  default:
                    return [];
                }
              })
            );
  }

}
