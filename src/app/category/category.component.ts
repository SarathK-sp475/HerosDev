import { Component, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CategoryService } from './services/category.service';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'hdev-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

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
  File: File | null = null;

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private toastr: ToastrService) { }

  private modalService = inject(NgbModal);

  open(content: TemplateRef<any>) {
    this.addForm.reset();
    this.imageUrl = null;
    this.modalService.open(content, { size: 'lg' })
  }

  Catname = ''
  Catdes = ''
  Catimg = ''
  CatCreatedAt = ''
  cat = undefined;
  openView(contentView: TemplateRef<any>, cat: any) {
    this.modalService.open(contentView, { size: 'lg' })
    this.Catname = cat.name
    this.Catdes = cat.description
    this.Catimg = cat.image.name
    this.CatCreatedAt = cat.createdAt
    this.cat = cat;
  }

  cat_id = ''

  // Delete
  openDlt(contentDlt: TemplateRef<any>, cat: any) {
    this.modalService.open(contentDlt, { size: 'lg', centered: true })
    this.cat_id = cat._id
  }// dlete


  name = ''
  des = ''
  //for opening edit modal and getting the data inside input
  openEdit(contentEdit: TemplateRef<any>, cat: any) {
    this.modalService.open(contentEdit, { size: 'lg' })
    this.name = cat.name
    this.des = cat.description
    if (cat.image && cat.image.name !== null) {
      this.imageUrl = cat.image.name;
    }
    this.cat_id = cat._id
    if (this.imageUrl) {
      this.addForm.get('image')?.setValue(this.imageUrl);
    }
    console.log(this.cat_id);
  }//edit

  //close modal 
  closeModal(modalService: NgbModalRef) {
    modalService.close();
    this.Catimg = '';
  }

  //reseting and closing all modals
  closeModalAdd(modalService: NgbModalRef) {
    modalService.close();
    this.addForm.reset();
    this.imageUrl = null;
  }

  category: any[] = []

  ngOnInit(): void {

    this.addForm = this.fb.group({
      name: [''],
      description: [''],
      image: ['']
    })

    //console.log("hwdhwgjhdg")
    this.getCategory();
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


  //Read and pagination
  getCategory(): void {
    this.categoryService.getCategory(this.currentPage, this.pageSize).subscribe((data) => {
      this.category = data.data.data;
      //this.imageUrl = data.data.data.image.name
      this.totalItems = data.data.totalCount; //pagination
      this.updatePagination(); //pagination
      this.calculateIndexes();
    });
  }


  //Add
  addCategory() {

    if (this.addForm.invalid) {
      this.addForm.get('name')?.markAsDirty();
      this.addForm.get('description')?.markAsDirty();
      return;
    }
    const formData = new FormData();
    formData.append('name', this.addForm.get('name')?.value);
    formData.append('description', this.addForm.get('description')?.value);
    formData.append('image', this.File!);


    // const addData = this.addForm.value as any;
    this.categoryService.addCategory(formData).subscribe({

      next: () => {

        this.modalService.dismissAll();

        this.toastr.success("Added sucessfully!")
        this.getCategory();

        this.addForm.reset({
          name: '',
          description: '',
          image: ''
        });
        this.File = null;

      },
      error: (error) => {
        //this.toastr.error("Yikes! Something went wrong")
        console.log(error.message);
      }
    }
    );
  }//add


  //Delete
  deleteCategory() {
    this.categoryService.deleteCategory(this.cat_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Deleted sucessfully!")
        this.getCategory();
      },
      error: (error) => {
        //this.toastr.error("Yikes! Something went wrong")
      }
    })
  }//dlt


  //Edit
  editCategory() {

    if (this.addForm.invalid) {
      this.addForm.get('name')?.markAsDirty();
      this.addForm.get('description')?.markAsDirty();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.addForm.get('name')?.value);
    formData.append('description', this.addForm.get('description')?.value);
    formData.append('image', this.File!);
    console.log(this.cat_id)
    this.categoryService.editCategory(formData, this.cat_id).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Edited sucessfully!")
        this.getCategory();
        this.addForm.reset({
          name: '',
          description: '',
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


  //Search
  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.categoryService.searchCategory(searchTerm).subscribe({
      next: (response) => {
        this.category = response.data.data;
      }
    })
  }//search

  //pagination
  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.getCategory();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
      this.getCategory();
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
    this.categoryService.getCategory(this.currentPage, this.pageSize, this.sortOrder, sortBy).subscribe((data) => {
      this.category = data.data.data;
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
    this.categoryService.getCategoryFilterDate(this.currentPage, this.pageSize, this.sortOrder, this.sortBy, fromDate, toDate)
    .subscribe((data) => {
      this.category = data.data.data; // Update category data
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

    this.categoryService.getCategory(this.currentPage, this.pageSize).subscribe((data) => {
      this.category = data.data.data;
      //this.imageUrl = data.data.data.image.name
      this.totalItems = data.data.totalCount; //pagination
      this.updatePagination(); //pagination
      this.calculateIndexes();
    });
  }// Filtering end

}


