import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadsService } from 'src/app/services/file-uploads.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public userForm: FormGroup;
  public imagenSubir: File;
  public imagenTemp: any = null;
  public usuarioGlobal: Usuario;
  public loading = false;
  

  constructor(private fb: FormBuilder,
              private usuario: UsuarioService,
              private fileUploads: FileUploadsService ) { 
                this.usuarioGlobal = usuario.usuario;
              }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombre: [this.usuarioGlobal.nombre, [Validators.required]],
      email: [this.usuarioGlobal.email, [Validators.email, Validators.required]],
    })
  }

  resetFormData(){
    this.userForm.setValue({
      nombre: this.usuarioGlobal.nombre,
      email: this.usuarioGlobal.email
    })
  }

  async actualizarUsuario(){
    this.loading = true; 
    const formData = this.userForm.getRawValue();

    try {
      const res: any = await this.usuario.putUser(formData).toPromise();
      if(res.ok){
        const {email, nombre} = formData;
        this.usuarioGlobal.nombre = nombre;
        this.usuarioGlobal.email = email;
        Swal.fire('Guardado', 'Cambios realizados con éxito', 'success')
      }else{
        Swal.fire('Error', res.msg , 'error')        
      }

      this.userForm.reset();
      this.resetFormData();
      
    } catch (error) {    
      Swal.fire('Error', error.error.msg, 'error');
    }

    this.userForm.reset();
    this.resetFormData();
    this.loading = false;
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
    try {
      const res: any = await this.fileUploads.actualizarImagen(this.imagenSubir, 'usuarios', this.usuarioGlobal.uid)
      .toPromise();
      if(res){
        this.imagenSubir = null;
        this.usuarioGlobal.img = res.fileName;
        Swal.fire('Guardado', 'Imagen actualizada con éxito', 'success')
      }else{
        Swal.fire('Error', res.msg, 'error')
      }
    } catch (error) {
      Swal.fire('Error', error.error.msg, 'error')
    }
    this.loading = false;
  }
}
