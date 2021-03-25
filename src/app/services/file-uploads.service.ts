import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadsService {

  constructor(private http: HttpClient) { }

  actualizarImagen(archivo: File, tipo: 'usuarios'|'medicos'|'hospitales', id: string){
    const body = new FormData();
    body.append('imagen', archivo);

    return this.http.put(`${BASE_URL}/upload/${tipo}/${id}`, body, {
      headers: {
        'x-token': localStorage.getItem('token') || ''
      }
    })
  }
}
