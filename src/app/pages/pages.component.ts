import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
declare function customInit(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private settingsService: SettingsService) {
    customInit();
   }

  ngOnInit(): void {
  }



}
