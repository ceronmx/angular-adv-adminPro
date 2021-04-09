import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService,
              private router: Router) { 
    this.usuario = usuarioService.usuario;
  }

  logout(){
    this.usuarioService.logout();
  }

  buscar(termino: string){
    termino = termino.trim();
    if(termino === '') {
      return;
    }

    this.router.navigateByUrl(`/dashboard/busqueda/${termino}`);
  }

}
