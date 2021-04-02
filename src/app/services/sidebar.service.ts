import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      sub: [
        {
          titulo: 'Inicio',
          ruta: '/',
        },
        {
          titulo: 'Progreso',
          ruta: 'progress',
        },
        {
          titulo: 'Gráficas',
          ruta: 'grafica1',
        },
        {
          titulo: 'Promesas',
          ruta: 'promesas',
        },
        {
          titulo: 'Rxjs',
          ruta: 'rxjs',
        },
      ],
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-folder-lock-open',
      sub: [
        {
          titulo: 'Usuarios',
          ruta: 'usuarios',
        },
        {
          titulo: 'Hospitales',
          ruta: 'hospitales',
        },
        {
          titulo: 'Médicos',
          ruta: 'medicos',
        }
      ],
    },
  ];

  constructor() {}
}
