import { Component, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NavbarService } from './services/navbar.service';

@Component({
  selector: 'hdev-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  imageUrl: string | ArrayBuffer | null = null;
  File: File | null = null;

  isDropdownOpen = false;
  private modalService = inject(NgbModal);

  constructor( private router : Router, private toastr: ToastrService, private navbarService: NavbarService){ }

  profile: any = [];

  ngOnInit(): void {
    this.getProfile();
    image: ['']
    firstName: ['']
  }

  toggleDropdown() {
    console.log('Dropdown toggled');
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
  }

  openLogout(contentLogout: TemplateRef<any>) {
    this.modalService.open(contentLogout, { size: 'lg', centered: true })
  }//opening logout modal

  
  logout(modal: NgbModalRef) {
    localStorage.clear();
    this.toastr.success('Logged Out Successfully');
    this.router.navigateByUrl('/login')
    modal.close()
  }

  //for activing a navbar
  checkActive(url:string):boolean{
    if(url===this.router.url){
      return true
    }
    else{
      return false
    }
  }//

  //Read
  getProfile() {
    this.navbarService.getProfile().subscribe((data) => {
      console.log(data);
      this.profile = data.data
      this.imageUrl = data.data.image.name
    });
  }//read

}