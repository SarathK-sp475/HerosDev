import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hdev-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  phoneNumberPattern = /^\+?\d{1,4}?\s?\(?\d{2,4}\)?[-.\s]?\d{2,5}[-.\s]?\d{1,6}$/;
  namePattern = /^[a-zA-Z\s]*$/;

  addForm !: FormGroup
  imageUrl: string | ArrayBuffer | null = null;
  File: File | null = null;

  constructor(private profileService: ProfileService, private fb: FormBuilder, private toastr: ToastrService) { }
  private modalService = inject(NgbModal);

  //variables for editing
  lastName = ''
  firstName = ''
  email = ''
  image = ''
  phoneNumber = ''
  //profileID = ''

  //for opening edit modal and getting the data inside input
  openEdit(contentEdit: TemplateRef<any>, profile: any) {
    this.modalService.open(contentEdit, { size: 'lg' })
    this.firstName = profile.firstName
    this.lastName = profile.lastName
    this.email = profile.email
    this.phoneNumber = profile.phoneNumber
    this.imageUrl = profile.image.name
    if (this.imageUrl) {
      this.addForm.get('image')?.setValue(this.imageUrl);

    }
    //this.profileID = profile._id
  }//edit

  //close modal 
  closeModal(modalService: NgbModalRef) {
    modalService.close();
    this.addForm.reset();
    this.imageUrl = null
  }//

  profile: any = [];

  ngOnInit(): void {
    this.getProfile();
    this.addForm = this.fb.group({
      image: [''],
      firstName: ['', [Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.pattern(this.namePattern)]],
      email: [{ value: '', disabled: true }],
      phoneNumber: ['', [Validators.pattern(this.phoneNumberPattern), Validators.maxLength(10)]]
    })

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
  getProfile() {
    this.profileService.getProfile().subscribe((data) => {
      console.log(data);
      this.profile = data.data
      this.imageUrl = data.data.image.name
    });
  }//read

  //Edit
  editProfile() {
    const formData = new FormData();
    formData.append('firstName', this.addForm.get('firstName')?.value);
    formData.append('lastName', this.addForm.get('lastName')?.value);
    formData.append('phoneNumber', this.addForm.get('phoneNumber')?.value);
    formData.append('email', this.addForm.get('email')?.value);
    formData.append('image', this.File!);

    this.profileService.editProfile(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.modalService.dismissAll();
        this.toastr.success("Edited sucessfully!")
        this.getProfile();

        this.addForm.reset({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          image: ''
        });
        this.imageUrl = null;
        this.File = null;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }//edit


}
