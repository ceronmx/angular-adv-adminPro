import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos: Medico[] = [];
  medicosTemp: Medico[] = [];
  loading: boolean = true;
  imgSub: Subscription = new Subscription();

  constructor(private medicosService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }
 
  ngOnInit(): void {
    this.getMedicos();
    this.imgSub = this.modalImagenService.imageChanges
    .pipe(
      delay(100)
    )
    .subscribe(
      () => this.getMedicos()
    );
  }

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  async getMedicos(){
    this.loading = true;
    try {
      const res = await this.medicosService.getMedicos().toPromise();
      this.medicos = res;
      this.medicosTemp = res;
      
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico.id, medico.img);
  }

  async buscar(termino: string){
    this.loading = true;
    termino = termino.trim();

    if(termino.length === 0){
      this.medicos = this.medicosTemp;
      this.loading = false;
      return;
    }

    try {
      const res = await this.busquedaService.buscar('medicos', termino).toPromise();
      this.medicos = res;
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  async eliminarMedico(medico: Medico){
    Swal.fire({
      title: '¿Está seguro?',
      text: `"${medico.nombre}" se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res: any = await this.medicosService.deleteMedico(medico.id).toPromise();
          if(res.ok){
            this.getMedicos();
            Swal.fire('Completado', `Medico eliminado con éxito`, 'success');
          }else {
            Swal.fire('Error', `No se ha eliminado el medico: ${medico.nombre}`, 'error');
          }
        } catch (error) {
          Swal.fire('Error', `No se ha eliminado el medico: ${medico.nombre}`, 'error');
        }
      }
    })
  }

}
