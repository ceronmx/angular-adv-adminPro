import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.mode';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  medicoForm: FormGroup =  this.fb.group({
    nombre: ['', Validators.required],
    hospital: ['', Validators.required]
  });
  subs: Subscription = new Subscription();
  medicoSeleccionado: any;
  hospitalSeleccionado: Hospital;
  hospitales: Hospital[] = [];

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicosService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: ModalImagenService) { }



  ngOnInit(): void {

    this.cargarSuscripciones();
    this.cargarHospitalesDropdown();

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private cargarSuscripciones(){
    this.subs.add(
      this.activatedRoute.params.subscribe(({id}) => {
        this.cargarMedicoId(id);
      })
    );

    this.subs.add(
      this.medicoForm.get('hospital').valueChanges
        .subscribe( hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find( hospital => hospital.id === hospitalId );
        }),
    );

    this.subs.add(
      this.modalService.imageChanges.pipe(
        delay(100)
      ).subscribe(() =>{
        this.cargarMedicoId(this.medicoSeleccionado.id);
      })
    )
  }


  private async cargarMedicoId(medicoId: string){
    this.loading = true;
    try {
      this.medicoSeleccionado = await this.medicosService.getMedicoById(medicoId).pipe(
        delay(100)
      ).toPromise();
      const {nombre, hospital: {_id}} = this.medicoSeleccionado;

      this.medicoForm.setValue({
        nombre,
        hospital: _id
      })

    } catch (error) {
      if(medicoId === 'nuevo'){
        this.loading = false
        return;
      } 
      this.router.navigateByUrl('/dashboard/medicos')
    }
    this.loading = false;
  }

  async nuevoMedico(){
    const {nombre} = this.medicoForm.value;
    if(this.medicoSeleccionado){
      try {
        const medicoPut = {
          ...this.medicoForm.value,
          id: this.medicoSeleccionado.id
        }
        const res: any = await this.medicosService.putMedico( medicoPut ).toPromise();
        
        if(res.ok){
          Swal.fire('Correcto', `Médico: ${nombre}, actualizado con éxito`, 'success');       
        }else{
          Swal.fire('Error', 'Médico no actualizado', 'error');
        }     
      } catch (error) {
        Swal.fire('Error', `${error}`, 'error') 
      }
      
    }else{
      try {
        const res: any = await this.medicosService.postMedico( this.medicoForm.value ).toPromise();
        if(res.ok){
          Swal.fire('Correcto', `Médico: ${nombre}, registrado con éxito`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${res.medicoDB.id}`);        
        }else{
          Swal.fire('Error', 'Médico no registrado', 'error');
        }     
      } catch (error) {
        Swal.fire('Error', `${error}`, 'error') 
      }  
    }

    this.medicoForm.markAsPristine();
  }

  private async cargarHospitalesDropdown(){
    try {
      this.hospitales = await this.hospitalService.getHospitales().toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  abrirModal(){
    this.modalService.abrirModal('medicos', this.medicoSeleccionado.id);
  }
}
