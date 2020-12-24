import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: [ './account-settings.component.css' ]
})
export class AccountSettingsComponent implements OnInit {

  public options: NodeListOf<Element>;

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.options = document.querySelectorAll('.selector');
    this.settingsService.checkTheme(this.options);
  }

  changeTheme(theme: string): void {
    this.settingsService.changeTheme(theme);
    this.settingsService.checkTheme(this.options);
  }

}
