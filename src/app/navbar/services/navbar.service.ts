import { Inject, Injectable } from '@angular/core';
import { appServiceConfig } from '../../AppConfig/appConfig.service';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { }

  getProfile() {
    return this.http.get<any>(`${this.config.apiEndPoint}/profile`)
  }
  
}
