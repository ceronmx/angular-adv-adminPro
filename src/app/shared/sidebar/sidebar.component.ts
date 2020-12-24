import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  options: any[] = [];

  constructor(private sidebarService: SidebarService) {
    this.options = sidebarService.menu;
   }

  ngOnInit(): void {
  }

}
