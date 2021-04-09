import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu = [];
  
  getMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu'));
  }
}
