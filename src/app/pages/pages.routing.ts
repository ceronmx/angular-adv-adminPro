import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';


export const routes: Routes = [
    {
      path: 'dashboard',
      component: PagesComponent,
      canActivate: [ AuthGuard ],
      canLoad: [AuthGuard],
      loadChildren: () => import('./children-routes.module').then(m => m.ChildrenRoutesModule)
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
