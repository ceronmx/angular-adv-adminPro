import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
      path: 'dashboard',
      component: PagesComponent,
      children: [
        { path: '', component: DashboardComponent },
        { path: 'grafica1', component: Grafica1Component },
        { path: 'progress', component: ProgressComponent },
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
