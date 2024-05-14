import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { appServiceConfig } from '../../AppConfig/appConfig.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { 
    console.log(this.config.apiEndPoint)
  }

  getCustomers(currentPage: number, pageSize: number, sortOrder: number = 1, sortBy: string = 'firstName') {
    return this.http.get<any>(`${this.config.apiEndPoint}/user?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`);
  }

  getCustomerFilterDate(currentPage: number, pageSize: number, sortOrder: number = 1, sortBy: string = 'firstName', fromDate: string , toDate: string, status: string ) {
    return this.http.get<any>(`${this.config.apiEndPoint}/user?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&fromDate=${fromDate}&toDate=${toDate}&filter[status]=${status}`);
  }

  editCustomers(editData : any,id:any){
    return this.http.patch<any>(`${this.config.apiEndPoint}/user/${id}`, editData);
  }

  blockCustomer(id : any) {
    return this.http.patch<any>(`${this.config.apiEndPoint}/user/block/${id}`,null);
  }

  searchCustomer(searchQuery : any){
    return this.http.get<any>(`${this.config.apiEndPoint}/user?searchTerm=${searchQuery}`);
  }

}

