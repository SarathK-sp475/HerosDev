import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { appServiceConfig } from '../../AppConfig/appConfig.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { 
    console.log(this.config.apiEndPoint)
  }

  getStore(currentPage:number,pageSize:number, sortOrder: number = -1, sortBy: string = 'createdAt') {
    return this.http.get<any>(`${this.config.apiEndPoint}/store?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`)
  }

  getStoreFilterDate(currentPage: number, pageSize: number, sortOrder: number = -1, sortBy: string = 'name', fromDate: string , toDate: string ) {
    return this.http.get<any>(`${this.config.apiEndPoint}/store?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&fromDate=${fromDate}&toDate=${toDate}`);
  }

  getStoreDiscount() {
    return this.http.get<any>(`${this.config.apiEndPoint}/store`);
  }

  addStore(addStore : any) {
    return this.http.post<any>(`${this.config.apiEndPoint}/store`, addStore);
  }

  deleteStore(id: any){
    return this.http.delete<any>(`${this.config.apiEndPoint}/store/${id}`)
  }
  
  editStore(editData : any,id:any){
    return this.http.patch<any>(`${this.config.apiEndPoint}/store/${id}`, editData);
  }

}
