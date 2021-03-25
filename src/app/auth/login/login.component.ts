import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare const gapi;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    password: ['123456', [Validators.required]],
    remember: [true]
  }); 


  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  async login() {
    await this.usuarioService.login(this.loginForm.value).toPromise()
      .then( res => {
        this.router.navigateByUrl('/');

        if (this.loginForm.get('remember').value){
          localStorage.setItem('email', this.loginForm.get('email').value);
        }else {
          localStorage.removeItem('email');
        }

      })
      .catch( err => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  checkValid(name: string){
    return this.loginForm.get(name).invalid && this.loginForm.get(name).touched;
  }


  // Sign in de Google

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': false,
      'theme': 'light',
    });

    this.startApp();

  }

  async startApp() {
    await this.usuarioService.initGoogle();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
    
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        async (googleUser) => {
          const id_token = await googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token).toPromise()
            .then(() => {
              this.ngZone.run(() => {
                this.router.navigateByUrl('/');       
              });
            }).catch((err) => {
              Swal.fire('Error', err.error.msg, 'error');
            });      
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
