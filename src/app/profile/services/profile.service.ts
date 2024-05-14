import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { appServiceConfig } from '../../AppConfig/appConfig.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { }

  getProfile() {
    return this.http.get<any>(`${this.config.apiEndPoint}/profile`)
  }

  editProfile(editData:any) {
    return this.http.patch<any>(`${this.config.apiEndPoint}/profile`, editData)
  }

}
