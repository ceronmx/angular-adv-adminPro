import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.mode';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  private get token(){
    return localStorage.getItem('token') || '';
  }

  private get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  getHospitales(){
    return this.http.get(`${base_url}/hospitales`, this.headers)
      .pipe(
        map(
          (res: {ok: string, hospitales: Hospital[]}) => res.hospitales
        )
      )
  }

  postHospital(nombre: string){
    return this.http.post(`${base_url}/hospitales`, {nombre}, this.headers);
  }

  putHospital(nombre: string, id: string){
    return this.http.put(`${base_url}/hospitales/${id}`, {nombre}, this.headers);
  }

  deleteHospital(id: string){
    return this.http.delete(`${base_url}/hospitales/${id}`, this.headers );
  }




}
