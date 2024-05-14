import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { appServiceConfig } from '../../AppConfig/appConfig.service';

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  constructor(@Inject(appServiceConfig) private config: AppConfig, private http: HttpClient) { }

  changePassword(newPassword: any) {
    return this.http.post<any>(`${this.config.apiEndPoint}/profile/change-password`, newPassword);
  }

}
