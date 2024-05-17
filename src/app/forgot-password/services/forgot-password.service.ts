import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { appServiceConfig } from '../../AppConfig/appConfig.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { }

  forgotPassword(email : any) {
    return this.http.post<any>(`${this.config.apiEndPoint}/auth/forgot-password`, email)
  }

}
