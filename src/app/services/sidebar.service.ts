import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [ {
    titulo: 'Dashboard',
    icono: 'mdi mdi-gauge',
    sub: [
      {
        titulo: 'Inicio', ruta: '/'
      },
      {
        titulo: 'Progreso', ruta: 'progress'
      },
      {
        titulo: 'Gráficas', ruta: 'grafica1'
      }
    ]
  }];

  constructor() { }
}
