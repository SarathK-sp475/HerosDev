import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { DiscountService } from './services/discount.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../category/services/category.service';
import { StoreService } from '../store/services/store.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hdev-discount',
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.scss'
})
export class DiscountComponent implements OnInit {

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
  category: any[] = []
  store: any[] = []
  selectedImage: File | null = null;


  constructor(private discountService: DiscountService, private fb: FormBuilder, private categoryService: CategoryService, private storeService: StoreService, private toastr: ToastrService) { }

  private modalService = inject(NgbModal);

  //for getting the add modal
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' })
  }

  dis_id = ''
  name = ''
  des = ''
  img = []
  storeName = ''
  categoryName = ''
  location = ''
  //for opening edit modal and getting the data inside input
  openEdit(contentEdit: TemplateRef<any>, discount: any) {
    this.modalService.open(contentEdit, { size: 'lg' })
    this.name = discount.name
    this.storeName = discount.storeId
    this.categoryName = discount.categoryId
    this.location = discount.storeId.location
    this.des = discount.description
    this.img = discount.image[0].name
    //console.log(this.storeName)
    this.dis_id = discount._id
  }
  compareselect(item1: any, item2: any) {
    return item1 && item2 ? item1._id === item2._id : item1 === item2;
  }//edit


  // Delete
  openDlt(contentDlt: TemplateRef<any>, discount: any) {
    this.modalService.open(contentDlt, { size: 'lg' ,centered:true})
    this.dis_id = discount._id
  }// dlete

  //for getting the data inside view modal
  Dname = ''
  Ddes = ''
  Dimg = []
  DstoreName = ''
  DcategoryName = ''
  Dlocation = ''
  discount = undefined

  // opening view modal
  openView(contentView: TemplateRef<any>, discount: any) {
    this.modalService.open(contentView, { size: 'lg' })
    this.Dname = discount.name
    this.DstoreName = discount.storeId.name
    this.DcategoryName = discount.categoryId.name
    this.Dlocation = discount.storeId.location
    this.Ddes = discount.description
    this.Dimg = discount.image[0].name
    this.discount = discount
  }// view modal data end
  

  discounts: any[] = [];

//close edit modal
closeModal(modalService:NgbModalRef) {
  modalService.close();
  this.addForm.reset();
}//

  ngOnInit(): void {

    this.addForm = this.fb.group({
      name: [''],
      storeId: [''],
      categoryId: [''],
      description: [''],
      image: ['']
    })

    this.getDiscount();
    this.getCategory();
    this.getStore();
  }

  // Function to handle file selection
  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }//image file selection

  //read and pagination
  getDiscount(): void {
    this.discountService.getDiscount(this.currentPage, this.pageSize).subscribe((data) => {
      this.discounts = data.data;
      this.totalItems = data.totalCount; //pagination
      this.updatePagination(); 
      this.calculateIndexes();
    })
  }


  //add
  addDiscount() {

    if(this.addForm.invalid){
      this.addForm.get('name')?.markAsDirty();
      this.addForm.get('storeId')?.markAsDirty();
      this.addForm.get('categoryId')?.markAsDirty();
      this.addForm.get('description')?.markAsDirty();
      this.addForm.get('image')?.markAsDirty();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.addForm.get('name')?.value);
    formData.append('storeId', this.addForm.get('storeId')?.value);
    formData.append('categoryId', this.addForm.get('categoryId')?.value);
    formData.append('description', this.addForm.get('description')?.value);
    formData.append('image', this.selectedImage!);

    this.discountService.addDiscount(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Added sucessfully!")
        this.getDiscount();
        this.addForm.reset({
          name: '',
          storeId: '',
          categoryId: '',
          description: '',
          image: ''
        });
        this.selectedImage = null;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  //edit
  editDiscount() {
    
    const formData = new FormData();
    formData.append('name', this.addForm.get('name')?.value);
    formData.append('storeId', this.addForm.get('storeId')?.value);
    formData.append('categoryId', this.addForm.get('categoryId')?.value);
    formData.append('description', this.addForm.get('description')?.value);
    formData.append('image', this.selectedImage!);


    const originalData = { ...this.addForm.value };
    const rearrangedData = {
      name: originalData.name,
      description: originalData.description, 
      storeId: originalData.storeId._id,
      categoryId: originalData.categoryId._id
    };
    console.log(rearrangedData)


    this.discountService.editDiscount(rearrangedData, this.dis_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Edited sucessfully!")
        this.getDiscount();
        this.addForm.reset({
          name: '',
          storeId: '',
          categoryId: '',
          description: '',
          image: ''
        });
        this.selectedImage = null;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  } //edit end

  
  //Delete
  deleteDiscount(){
    this.discountService.deleteDiscount(this.dis_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Deleted sucessfully!")
        this.getDiscount();
      },
      error: (error) => {
        console.log(error.message);
      }
    })
  }//dlt

  //for getting the cat_Id 
  getCategory() {
    this.categoryService.getCategoryDiscont().subscribe((dataa) => {
      console.log(dataa);
      this.category = dataa.data.data;

    });
  }

  //for getting the store_Id
  getStore() {
    this.storeService.getStoreDiscount().subscribe((dataa) => {
      console.log(dataa);
      this.store = dataa.data;
    });
  }


  //Search
  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.discountService.searchDiscount(searchTerm).subscribe({
      next: (response) => {
        this.discounts = response.data;
      }
    })
  }//search


  //pagination
  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1; // Reset to the first page when changing page size
    this.getDiscount();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
      this.getDiscount();
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
    this.discountService.getDiscount(this.currentPage, this.pageSize, this.sortOrder, sortBy).subscribe((data) => {
      this.discounts = data.data;
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
    this.discountService.getDiscountFilterDate(this.currentPage, this.pageSize, this.sortOrder, this.sortBy, fromDate, toDate)
    .subscribe((data) => {
      this.discounts = data.data; // Update category data
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

    this.discountService.getDiscount(this.currentPage, this.pageSize).subscribe((data) => {
      this.discounts = data.data;
      //this.imageUrl = data.data.data.image.name
      this.totalItems = data.totalCount; //pagination
      this.updatePagination(); //pagination
      this.calculateIndexes();
    });
  }// Filtering end

}
