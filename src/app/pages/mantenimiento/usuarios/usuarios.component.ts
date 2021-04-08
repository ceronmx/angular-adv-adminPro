import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usersList: Usuario[];
  usuariosTemp: Usuario[];
  total: number;
  desde = 0;
  end = false;
  loading = false;
  imgSub: Subscription;

  constructor(private users: UsuarioService,
              private busquedas: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {
    this.getUsers();
    this.imgSub = this.modalImagenService.imageChanges
    .pipe(
      delay(100)
    )
    .subscribe(
      () => {
        this.getUsers();
      }
    )
  }

  
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  async getUsers(){
    this.loading = true;
    try {
      const {total, usuarios} = await this.users.getUsers(this.desde).toPromise();
      this.total = total;
      this.usersList = usuarios;
      this.usuariosTemp = usuarios;
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  cambiarPagina(step: number){
    this.desde += step;

    if(step < 0){
      this.end = false;
    }

    if(this.desde < 0){
      this.desde = 0;
    } else if(this.desde > this.total){    
      this.desde  -= step;
      this.end = true;
    }

    this.getUsers();
  }

  async buscar(termino: string){
    termino = termino.trim();
    this.loading = true;

    if(termino.length === 0){
      this.usersList = this.usuariosTemp;
      this.loading = false;
      return;
    }

    try {
      const res = await this.busquedas.buscar('usuarios', termino).toPromise()
      this.usersList = res;
    } catch (error) {
      console.log(error);
    }

    this.loading = false;
  }

  borrarUsuario(usuario: Usuario){
    if(usuario.uid === this.users.uid){
      Swal.fire(
        'Error',
        'No puede eliminar su cuenta de usuario',
        'error'
      );
      return;
    }


    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Está a punto de eliminar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res: any = await this.users.deleteUser(usuario).toPromise();

          if(res.ok){          
            Swal.fire(
              'Usuario eliminado',
              `${usuario.nombre} eliminado correctamente`,
              'success'
            );
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Ups...',
              text: 'Ha ocurrido un error',
            });
          }
    
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Ha ocurrido un error',
          });
        }
        
        this.getUsers();
      }
    })
  }

  async cambiarRole(usuario: Usuario){
    this.loading = true;
    const res: any = await this.users.putFullUser(usuario).toPromise();
    if(res.ok){

    }else{
      Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: 'Ha ocurrido un error',
      });
    }

    this.loading = false;
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
