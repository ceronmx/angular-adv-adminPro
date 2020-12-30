import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // this.getUser().then( data => console.log(data) );

    // const promesa = new Promise( (resolve, reject) => {

    //   if (false) {
    //     resolve('Ciao mondo');
    //   } else {
    //     reject('Adiocito');
    //   }
    // });

    // promesa.then((data) => {
    //   console.log(data);
    // }).catch((error) => console.log('Error: ', error));

    // console.log('Fin del ngOnInit');
  }


  getUser() {
    return new Promise( (resolve) => {
      fetch('https://reqres.in/api/users')
      .then( (response) => response.json() )
      .then( (body) => resolve(body.data) )
    });
  }

}
