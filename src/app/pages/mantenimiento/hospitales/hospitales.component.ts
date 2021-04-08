import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.mode';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html'
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  private hospitalesTemp: Hospital[] = [];
  public loading: boolean = true;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.getHospitales();
    this.imgSubs = this.modalImagenService.imageChanges
    .pipe(
      delay(100)
    )
    .subscribe(() => {
      this.getHospitales();
    })
  }

  private async getHospitales(){
    this.loading = true;
    try {
      const hospitales = await this.hospitalService.getHospitales().toPromise();
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  async editarHospital(hospital: Hospital) {
    try {
      const res: any = await this.hospitalService.putHospital(hospital.nombre, hospital.id).toPromise();
      if(res.ok){
        Swal.fire('Completado', 'Cambios guardados con éxito', 'success');
      }else{
        Swal.fire('Error', 'No se han podido guardar los cambios', 'error');
      }
      
    } catch (error) {
      Swal.fire('Error', 'No se han podido guardar los cambios', 'error');
    }
  }

  async nuevoHospital(){
    const {value} = await Swal.fire<string>({
      title: 'Nuevo hospital',
      input: 'text',
      inputLabel: 'Ingrese nombre del nuevo hospital',
    }); 

    if (value) {
      try {
        const res: any = await this.hospitalService.postHospital(value).toPromise();
        if(res.ok){
          this.getHospitales();
          Swal.fire('Completado', 'Hospital creado con éxito', 'success');
        }else{
          Swal.fire('Error', 'No se ha creado el nuevo hospital', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'No se ha creado el nuevo hospital', 'error');
      }
    }
  }

  eliminarHospital(hospital: Hospital){
    Swal.fire({
      title: '¿Está seguro?',
      text: `"${hospital.nombre}" se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res: any = await this.hospitalService.deleteHospital(hospital.id).toPromise();
          if(res.ok){
            this.getHospitales();
            Swal.fire('Completado', `Hospital eliminado con éxito`, 'success');
          }else {
            Swal.fire('Error', `No se ha eliminado el hospital: ${hospital.nombre}`, 'error');
          }
        } catch (error) {
          Swal.fire('Error', `No se ha eliminado el hospital: ${hospital.nombre}`, 'error');
        }
      }
    })
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital.id, hospital.img);
  }

  async buscar(termino: string){
    this.loading = true;
    termino = termino.trim();    

    if(termino.length === 0){
      this.hospitales = this.hospitalesTemp;
      this.loading = false;
      return;
    }

    try {
      const res = await this.busquedasService.buscar('hospitales', termino).toPromise();
      this.hospitales = res;
    } catch (error) {
      console.log(error);
    }

    this.loading = false;
  }

}
