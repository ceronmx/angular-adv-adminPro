import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public linkTheme = document.querySelector('#theme');
  defaultTheme = 'red-dark';

  constructor() {
    this.setTheme();
   }


  setTheme(): void {
    const url = localStorage.getItem('theme') || `../assets/css/colors/${this.defaultTheme}.css`;
    document.querySelector('#theme').setAttribute('href', url);
   }

  changeTheme(theme: string): void {
    const url = `../assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);
  }


  checkTheme(options: NodeListOf<Element>): void {
    options.forEach(element => {
      element.classList.remove('working');

      const btnTheme = element.getAttribute('data-theme');
      const btnUrl = `../assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if (btnUrl === currentTheme) {
        element.classList.add('working');
      }
    });
  }
}
