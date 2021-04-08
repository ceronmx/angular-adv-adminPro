import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  private get token(){
    return localStorage.getItem('token');
  }

  private get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  getMedicos(){
    return this.http.get(`${base_url}/medicos`, this.headers)
      .pipe(
        map(
          (res: {ok: string, medicos: Medico[]}) => res.medicos
        )
      );
  }

  getMedicoById(id: string){
    return this.http.get(`${base_url}/medicos/${id}`, this.headers)
      .pipe(
        map(
          (res: {ok: string, medico: any}) => res.medico
        )
      );
  }

  postMedico(medico: {nombre: string, hospital: string}){
    return this.http.post(`${base_url}/medicos`, medico, this.headers);
  }

  putMedico(medico: Medico){
    return this.http.put(`${base_url}/medicos/${medico.id}`, medico, this.headers);
  }

  deleteMedico(id: string){
    return this.http.delete(`${base_url}/medicos/${id}`, this.headers );
  }
  

}
