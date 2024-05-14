import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { CustomersService } from './services/customers.service';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hdev-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {

  phoneNumberPattern = /^\+?\d{1,4}?\s?\(?\d{2,4}\)?[-.\s]?\d{2,5}[-.\s]?\d{1,6}$/;
  namePattern = /^[a-zA-Z\s]*$/;

  //pagination
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  pages: number[] = [];
  totalPages: number = 0;
  //pagination

  addForm !: FormGroup
  customer: any;
  imageUrl: string | ArrayBuffer | null = null;
  File: File | null = null;

  constructor(private customerService: CustomersService, private fb: FormBuilder, private toastr: ToastrService) { }

  private modalService = inject(NgbModal);

  firstName = ''
  lastName = ''
  phoneNumber = ''
  cust_id = ''

  //for opening edit modal and getting the data inside input
  openEdit(contentEdit: TemplateRef<any>, customer: any) {
    this.modalService.open(contentEdit, { size: 'lg' })
    this.firstName = customer.firstName
    this.lastName = customer.lastName
    this.phoneNumber = customer.phoneNumber
    if (customer.image && customer.image.name !== null) {
      this.imageUrl = customer.image.name;
    }

    this.cust_id = customer._id
    console.log(this.cust_id)
    if (this.imageUrl) {

      this.addForm.get('image')?.setValue(this.imageUrl);
    }
  }//edit

  //close modal
  closeEdit(modalService: NgbModalRef) {
    modalService.close();
    this.addForm.reset();
    this.imageUrl = null
  }//

  // Block
  openBlock(contentBlock: TemplateRef<any>, customer: any) {
    this.modalService.open(contentBlock, { size: 'lg', centered: true })
    this.cust_id = customer._id
  }// block

  customers: any[] = []

  ngOnInit(): void {

    this.addForm = this.fb.group({
      firstName: ['', [Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.pattern(this.namePattern)]],
      phoneNumber: ['', [Validators.pattern(this.phoneNumberPattern), Validators.maxLength(10)]],
      image: ['']
    })

    this.getCustomers();

  }

  // Function to handle file selection
  onFileSelected(event: any) {
    this.File = event.target.files[0]; // Get the selected file
    if (this.File) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result; // Assign the data URL to imageUrl
      };
      reader.readAsDataURL(this.File);
    }
  }//image file selection

  //Read
  getCustomers() {
    this.customerService.getCustomers(this.currentPage, this.pageSize).subscribe((data) => {
      this.customers = data.data;
      //this.imageUrl = data.data.image.name
      this.totalItems = data.totalCount; //pagination
      this.updatePagination(); //pagination
      this.calculateIndexes();
      console.log(this.imageUrl)
    });
  }//read


  //Edit
  editCustomers() {

    if (this.addForm.invalid) {
      this.addForm.get('firstName')?.markAsDirty();
      this.addForm.get('lastName')?.markAsDirty();
      this.addForm.get('phoneNumber')?.markAsDirty();
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.addForm.get('firstName')?.value);
    formData.append('lastName', this.addForm.get('lastName')?.value);
    formData.append('phoneNumber', this.addForm.get('phoneNumber')?.value);
    if (this.File != null) {
      formData.append('image', this.File!);
    }

    this.customerService.editCustomers(formData, this.cust_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Edited sucessfully!")
        this.getCustomers();
        this.addForm.reset({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          image: ''
        });
        this.imageUrl = null;
        this.File = null;
      },
      error: (error) => {
        this.modalService.dismissAll();
        this.toastr.error(error.error.message)
        console.log(error.message);
      }
    });
  }//edit

  //block
  blockCustomer() {
    this.customerService.blockCustomer(this.cust_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("User blocked sucessfully!")
        this.getCustomers();
      }
    })
  }//block


  //Search
  search(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.customerService.searchCustomer(search).subscribe({
      next: (response) => {
        this.customers = response.data;
      }
    })
  }//search


  //pagination
  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1; // Reset to the first page when changing page size
    this.getCustomers();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
      this.getCustomers();
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
  }

  calculateIndexes(): void {
    this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalItems);
  }//pagination


  //Sorting using span image
  click: any = true
  sortOrder: number = -1
  toggleSort(sortBy: string) {
    this.sortOrder = this.click ? 1 : -1;
    this.click = !this.click;
    this.customerService.getCustomers(this.currentPage, this.pageSize, this.sortOrder, sortBy).subscribe((data) => {
      this.customers = data.data;
    })
  }// sorting

  
  //Filtering the data using toggledown
  sortBy: string  = '';
  status: string = '';
  fromDateModel: NgbDateStruct | null = null;
  toDateModel: NgbDateStruct | null = null;

  toggleAscDesc(name: string) {
    this.sortOrder = this.sortBy === name ? -this.sortOrder : this.sortOrder;
    this.sortBy = name;
  }

  
  toggleByStatus(status: string){
    this.status = status;
    this.sortBy = status;
  }

  applyFilters() {
    this.updateData();
  }

  updateData() {
  const fromDate = this.fromDateModel ? this.formatDate(this.fromDateModel) : '';
  const toDate = this.toDateModel ? this.formatDate(this.toDateModel) : '';
    this.customerService.getCustomerFilterDate(this.currentPage, this.pageSize, this.sortOrder, this.sortBy, fromDate, toDate, this.status)
    .subscribe((data) => {
      this.customers = data.data; // Update category data
    });
  }

  private formatDate(date: NgbDateStruct | null): string {
    if (!date) return '';
    const year = date.year;
    const month = ('0' + date.month).slice(-2);
    const day = ('0' + date.day).slice(-2);
    return `${year}-${month}-${day}`;
  }

  ascendingChecked: boolean = false;
  descendingChecked: boolean = false;
  clearAllFilter() {
    this.fromDateModel = null;
    this.toDateModel = null;
    this.ascendingChecked = false;
    this.descendingChecked = false;

    // Reset radio buttons
    const ascendingRadio = document.getElementById('ascendingRadio') as HTMLInputElement;
    const descendingRadio = document.getElementById('descendingRadio') as HTMLInputElement;
    const statusRadio1 = document.getElementById('statusRadio1') as HTMLInputElement;
    const statusRadio2 = document.getElementById('statusRadio2') as HTMLInputElement;

    if (ascendingRadio && descendingRadio) {
        ascendingRadio.checked = false;
        descendingRadio.checked = false;
        statusRadio1.checked = false;
        statusRadio2.checked = false;
    }

    this.customerService.getCustomers(this.currentPage, this.pageSize).subscribe((data) => {
      this.customers = data.data;
      //this.imageUrl = data.data.data.image.name
      this.totalItems = data.totalCount; //pagination
      this.updatePagination(); //pagination
      this.calculateIndexes();
    });
  }// Filtering end

}
