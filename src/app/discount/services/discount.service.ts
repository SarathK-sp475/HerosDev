import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { appServiceConfig } from '../../AppConfig/appConfig.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(@Inject(appServiceConfig) private config : AppConfig, private http : HttpClient ) { 
    console.log(this.config.apiEndPoint)
  }

  getDiscount(currentPage:number,pageSize:number, sortOrder: number = -1, sortBy: string = 'createdAt') {
    return this.http.get<any>(`${this.config.apiEndPoint}/discount?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`);
  }

  getDiscountFilterDate(currentPage: number, pageSize: number, sortOrder: number = -1, sortBy: string = 'name', fromDate: string , toDate: string ) {
    return this.http.get<any>(`${this.config.apiEndPoint}/discount?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&fromDate=${fromDate}&toDate=${toDate}`);
  }

  addDiscount(addData : any) {
    return this.http.post<any>(`${this.config.apiEndPoint}/discount`, addData);
  }
  
  editDiscount(editData : any,id:any){
    return this.http.patch<any>(`${this.config.apiEndPoint}/discount/${id}`, editData);
  }

  deleteDiscount(id: any){
    return this.http.delete<any>(`${this.config.apiEndPoint}/discount/${id}`)
  }

  searchDiscount(searchQuery : any){
    return this.http.get<any>(`${this.config.apiEndPoint}/discount?searchTerm=${searchQuery}`);
  }

}
