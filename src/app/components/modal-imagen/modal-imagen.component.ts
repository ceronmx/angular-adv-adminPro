import { Component, OnInit } from '@angular/core';
import { FileUploadsService } from 'src/app/services/file-uploads.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any = null;
  loading = false;


  constructor(public modalImagenService: ModalImagenService,
              private fileUploads: FileUploadsService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.modalImagenService.cerrarModal();
  }

  
  cambiarImagen( imagen: File ){
    this.imagenSubir = imagen;

    if(!imagen){
      return this.imagenTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imagen);

    reader.onloadend = () => {
      this.imagenTemp = reader.result;  
    };
  }

  
  async actualizarImagen(){
    this.loading = true;
    const uid = this.modalImagenService.uid;
    const tipo = this.modalImagenService.tipo;

    try {
      const res: any = await this.fileUploads.actualizarImagen(this.imagenSubir, tipo, uid)
      .toPromise();
      if(res.ok){
        this.imagenSubir = null;
        Swal.fire('Guardado', 'Imagen actualizada con éxito', 'success')
        this.modalImagenService.imageChanges.emit(true);
      }else{
        Swal.fire('Error', res.msg, 'error')
      }
    } catch (error) {
      Swal.fire('Error', error.error.msg, 'error')
    }
    this.imagenTemp = null;
    this.modalImagenService.cerrarModal();
    this.loading = false;
  }
}
