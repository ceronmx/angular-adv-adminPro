import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['ejemplo', [Validators.required]],
    email: ['ejemplo@ejemplo.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    password: ['123456', [Validators.required]],
    password2: ['123456', [Validators.required]],
    terms: [, [Validators.required]]
  },{
    validators: [ this.checkPasswords('password', 'password2') ]
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { }

  async register(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    await this.usuarioService.createUser(this.registerForm.value)
    .toPromise()
    .then( res=> {
      console.log(res);
      Swal.fire('Ok', 'Usuario creado, inicie sesión', 'success');
      this.router.navigateByUrl('/login');
    })
    .catch((err) => {
      console.warn(err);
      Swal.fire('Error', err.error.msg, 'error');
    });
  }

  checkValid(name: string){
    return this.registerForm.get(name).invalid && this.registerForm.get(name).touched;
  }

  checkTerms(){
    return this.formSubmitted && !this.registerForm.get('terms').value
  }

  checkPasswords(pass1Name: string, pass2Name: string){
    return (formGrop: FormGroup): ValidationErrors | null => {
      const pass1Control = formGrop.get(pass1Name);
      const pass2Control = formGrop.get(pass2Name);

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
        return null
      } else {
        pass2Control.setErrors({noMatch: true});
      }
    }
  }

}
