import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private ocultarModal = true;
  tipo: 'usuarios'|'medicos'|'hospitales';
  uid: string;
  img: string;
  imageChanges = new EventEmitter();
  
  get ocultar(){
    return this.ocultarModal;
  }

  constructor() { }

  abrirModal(tipo: 'usuarios'|'medicos'|'hospitales', uid, img = 'no-image'){
    this.ocultarModal = false;
    this.tipo = tipo;
    this.uid = uid;
    if(img.includes('https')){
      this.img = img;
    }else{
      this.img = `${base_url}/upload/${tipo}/${img}`
    }
  }

  cerrarModal(){
    this.ocultarModal = true;
  }
}
