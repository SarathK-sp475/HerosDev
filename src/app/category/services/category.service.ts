import { Inject, Injectable } from '@angular/core';
import { appServiceConfig } from '../../AppConfig/appConfig.service';
import { AppConfig } from '../../AppConfig/appConfig.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(@Inject(appServiceConfig) private config: AppConfig, private http: HttpClient) {
    // console.log(this.config.apiEndPoint)
  }

  //pagination
  getCategory(currentPage: number, pageSize: number, sortOrder: number = 1, sortBy: string = 'name') {
    return this.http.get<any>(`${this.config.apiEndPoint}/category?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`);
  }//pagination

  ///////////////////
  getCategoryFilterDate(currentPage: number, pageSize: number, sortOrder: number = 1, sortBy: string = 'name', fromDate: string , toDate: string ) {
    return this.http.get<any>(`${this.config.apiEndPoint}/category?page=${currentPage}&limit=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&fromDate=${fromDate}&toDate=${toDate}`);
  }//////////////////

  getCategoryDiscont() {
    return this.http.get<any>(`${this.config.apiEndPoint}/category`);
  }

  addCategory(addData: any) {
    return this.http.post<any>(`${this.config.apiEndPoint}/category`, addData);
  }

  deleteCategory(id: any) {
    return this.http.delete<any>(`${this.config.apiEndPoint}/category/${id}`)
  }

  editCategory(editData: any, id: any) {
    return this.http.patch<any>(`${this.config.apiEndPoint}/category/${id}`, editData);
  }

  searchCategory(searchQuery: any) {
    return this.http.get<any>(`${this.config.apiEndPoint}/category?searchTerm=${searchQuery}`);
  }

}
