import { Component } from '@angular/core';
import { ChangepasswordService } from './services/changepassword.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'hdev-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss'
})
export class ChangepasswordComponent {

  addForm !: FormGroup
  
  constructor(private changePasswordService: ChangepasswordService, private fb: FormBuilder, private toastr: ToastrService, private router : Router) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['', Validators.minLength(8)],
      confirmPassword: ['']
    })
  }

  changePassword() {
    if (this.addForm.invalid || this.addForm.get('confirmPassword')?.value !== this.addForm.get('newPassword')?.value) {
      if (this.addForm.get('confirmPassword')?.value !== this.addForm.get('newPassword')?.value) {
        this.addForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      }
      this.addForm.get('currentPassword')?.markAsDirty();
      this.addForm.get('newPassword')?.markAsDirty();
      this.addForm.get('confirmPassword')?.markAsDirty();
      return;
    }
    
    this.changePasswordService.changePassword(this.addForm.value).subscribe({
      next: (data) => {
        if (data.statusCode == 200 && data.success) {
          this.router.navigateByUrl('/dashboard/profile');
          this.addForm.reset();
          this.toastr.success(data.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        this.addForm.reset();
      }
    });
  }  

  cancel(){
    this.router.navigateByUrl('/dashboard/profile');
    this.addForm.reset();
  }

  hidecurrentpassword: boolean = true;
  togglePassword() {
    this.hidecurrentpassword = !this.hidecurrentpassword;
  }

  hideNewpassword: boolean = true;
  togglePassword2(){
    this.hideNewpassword = !this.hideNewpassword;
  }

  hideConfirmpassword: boolean = true;
  togglePassword3(){
    this.hideConfirmpassword = !this.hideConfirmpassword;
  }
}
