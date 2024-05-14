import { Inject, Injectable } from '@angular/core';
import { appServiceConfig } from '../../AppConfig/appConfig.service';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isloggedIn: boolean = false
  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { }


  login(loginData : any) {
    this.isloggedIn = true
    return this.http.post<any>(`${this.config.apiEndPoint}/auth/signin`, loginData)
  }

  loggedIn():boolean {
    return !!localStorage.getItem('logintoken');
  }
}
