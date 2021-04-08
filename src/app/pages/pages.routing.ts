import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';


import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimiento/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimiento/medicos/medicos.component';
import { MedicoComponent } from './mantenimiento/medicos/medico/medico.component';


export const routes: Routes = [
    {
      path: 'dashboard',
      component: PagesComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
        { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes'} },
        { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica #1'} },
        { path: 'progress', component: ProgressComponent, data: {titulo: 'ProgressBar'} },
        { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'} },
        { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'} },

        //Mantenimiento pages
        { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'} },
        { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Mantenimiento de usuarios'} },
        { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'} },
        { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de médicos'} },
        { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Información del médico'} },
    
    
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
      ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
})
export class PagesRoutingModule { }
