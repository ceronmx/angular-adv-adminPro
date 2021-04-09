import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.mode';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  private subs: Subscription = new Subscription();
  medicos: Medico[] = [];
  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  loading = true;

  constructor(private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.iniciarSuscripciones();
  }

  private iniciarSuscripciones(){
    this.subs.add(
      this.activatedRoute.params.subscribe(({termino})=> {
        this.getBusqueda(termino);
        this.loading = false;
      })
    )
  }

  private async getBusqueda(termino: string){
    this.loading = true;
    try {
      const res: any = await this.busquedaService.buscarTodo(termino).toPromise();
      this.medicos = res.medicos;
      this.usuarios = res.usuarios;
      this.hospitales = res.hospitales;
    } catch (error) {
      console.log(error);
    }
  }

}
