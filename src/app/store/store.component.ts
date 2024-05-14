import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { StoreService } from './services/store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hdev-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit {

  phoneNumberPattern = /^\+?\d{1,4}?\s?\(?\d{2,4}\)?[-.\s]?\d{2,5}[-.\s]?\d{1,6}$/;
  websitePattern = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[\w\/.-]*$/;

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
  imageUrl: string | ArrayBuffer | null = null;
  File:File | null=null;

  constructor(private storeService: StoreService, private fb: FormBuilder, private toastr: ToastrService) { }

  private modalService = inject(NgbModal);

  open(content: TemplateRef<any>) {
    this.addForm.reset();
    this.imageUrl = null;
    this.modalService.open(content, { size: 'lg' })
  }//opening add modal

  storesname = ''
  storeslocation = ''
  storesnumber = ''
  storeswebsite = ''
  storesdescript = ''
  storesimg = ''
  stores = undefined;
  openView(contentView: TemplateRef<any>, stores: any) {
    this.modalService.open(contentView, { size: 'lg' })
   
    this.storesname = stores.name
    this.storeslocation = stores.location
    this.storesnumber = stores.contactNumber
    this.storeswebsite = stores.website
    this.storesdescript = stores.description
    if (stores.image && stores.image.name) {
      this.storesimg = stores.image.name;
    }
    console.log(stores)
    this.stores = stores;
   

  }//view modal

  str_id = ''

  //close modal 
  closeModal(modalService: NgbModalRef) {
    modalService.close();
    this.storesimg = '';
  }//

  //reseting and closing all modals
  closeModalAdd(modalService:  NgbModalRef){
    modalService.close();
    this.addForm.reset();
    this.imageUrl = null;
  }

  // Delete
  openDlt(contentDlt: TemplateRef<any>, store: any) {
    this.modalService.open(contentDlt, { size: 'lg', centered: true })
    this.str_id = store._id
  }// dlete

  name=''
  location=''
  number=''
  website=''
  descript=''
  //for opening edit modal and getting the data inside input
  openEdit(contentEdit: TemplateRef<any>, store: any) {
    this.modalService.open(contentEdit, { size: 'lg' })
    console.log(store)
    this.name = store.name
    this.location = store.location
    this.number = store.contactNumber
    this.website = store.website
    this.descript = store.description
    this.imageUrl = store.image.name
    this.str_id = store._id
    if (this.imageUrl) {
      this.addForm.get('image')?.setValue(this.imageUrl);
    }
    // console.log(store.name)
  }//edit


  store: any[] = [];

  ngOnInit(): void {

    this.addForm = this.fb.group({
      name: [''],
      description: [''],
      location: [''],
      contactNumber: ['', [Validators.pattern(this.phoneNumberPattern), Validators.maxLength(10)]],
      website: ['', [Validators.pattern(this.websitePattern)]],
      image: ['']
    })

    this.getStore();
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
  getStore() {
    this.storeService.getStore(this.currentPage, this.pageSize).subscribe((data) => {
      console.log(data);
      this.store = data.data
      this.totalItems = data.totalCount; //pagination
      this.updatePagination(); //pagination
      this.calculateIndexes(); //pagination
    });
  }//read

  //Add
  addStore() {

    if(this.addForm.invalid){
      this.addForm.get('name')?.markAsDirty();
      this.addForm.get('description')?.markAsDirty();
      this.addForm.get('location')?.markAsDirty();
      this.addForm.get('website')?.markAsDirty();
      this.addForm.get('contactNumber')?.markAsDirty();
      return;
    }

    if(this.addForm.get('website')?.value == null){
      this.addForm.get('website')?.setValue('');
    }

    const formData = new FormData();
    formData.append('name', this.addForm.get('name')?.value);
    formData.append('contactNumber', this.addForm.get('contactNumber')?.value);
    formData.append('website', this.addForm.get('website')?.value);
    formData.append('description', this.addForm.get('description')?.value);
    formData.append('location', this.addForm.get('location')?.value);
    formData.append('image', this.File!);

    this.storeService.addStore(formData).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.toastr.success("Added sucessfully!")
        this.getStore();

        this.addForm.reset({
          name: '',
          description: '',
          location: '',
          contactNumber: '',
          website: '',
          image: ''
        })
      },
      error: (error) => {
        //this.toastr.warning("Email Id already registered")
        console.log(error.message)
      }
    });

  }//add

  //Delete
  deleteStore() {
    this.storeService.deleteStore(this.str_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Deleted sucessfully!")
        this.getStore();
      },
      error: (error) => {
        console.log(error.message);
      }
    })
  }//dlt



  //edit
  editStore() {

    if(this.addForm.invalid){
      this.addForm.get('name')?.markAsDirty();
      this.addForm.get('description')?.markAsDirty();
      this.addForm.get('location')?.markAsDirty();
      this.addForm.get('website')?.markAsDirty();
      this.addForm.get('contactNumber')?.markAsDirty();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.addForm.get('name')?.value);
    formData.append('contactNumber', this.addForm.get('contactNumber')?.value);
    formData.append('website', this.addForm.get('website')?.value);
    formData.append('description', this.addForm.get('description')?.value);
    formData.append('location', this.addForm.get('location')?.value);
    formData.append('image', this.File!);
    this.storeService.editStore(formData, this.str_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Edited sucessfully!")
        this.getStore();
        this.addForm.reset({
          name: '',
          contactNumber: '',
          location: '',
          website: '',
          description: '',
          image:''
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


   //pagination
   onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1; // Reset to the first page when changing page size
    this.getStore();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
      this.getStore();
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
  sortOrder: number = 1
  toggleSort(sortBy: string) {

    this.sortOrder = this.click ? -1 : 1;
    this.click = !this.click;
    this.storeService.getStore(this.currentPage, this.pageSize, this.sortOrder, sortBy).subscribe((data) => {
      this.store = data.data;
    })
  }// sorting


    //Filtering the data using toggledown
    sortBy: string  = 'name';
    fromDateModel: NgbDateStruct | null = null;
    toDateModel: NgbDateStruct | null = null;
  
    toggleAscDesc(sortBy: string) {
      this.sortOrder = this.sortBy === sortBy ? -this.sortOrder : this.sortOrder;
      this.sortBy = sortBy;
    }
  
    applyFilters() {
      this.updateData();
    }
  
    updateData() {
    const fromDate = this.fromDateModel ? this.formatDate(this.fromDateModel) : '';
    const toDate = this.toDateModel ? this.formatDate(this.toDateModel) : '';
      this.storeService.getStoreFilterDate(this.currentPage, this.pageSize, this.sortOrder, this.sortBy, fromDate, toDate)
      .subscribe((data) => {
        this.store = data.data; // Update category data
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
  
      if (ascendingRadio && descendingRadio) {
          ascendingRadio.checked = false;
          descendingRadio.checked = false;
      }
  
      this.storeService.getStore(this.currentPage, this.pageSize).subscribe((data) => {
        this.store = data.data;
        //this.imageUrl = data.data.data.image.name
        this.totalItems = data.totalCount; //pagination
        this.updatePagination(); //pagination
        this.calculateIndexes();
      });
    }// Filtering end


}

