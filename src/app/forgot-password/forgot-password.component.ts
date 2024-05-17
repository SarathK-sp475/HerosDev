import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from './services/forgot-password.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hdev-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forgotPasswordForm !: FormGroup;

  constructor(private fb : FormBuilder, private forgotService : ForgotPasswordService, private router : Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    
    this.forgotPasswordForm = this.fb.group({
      email : ['', [Validators.pattern(this.emailPattern)]],
      platform:['web'],
  });
  }

  forgotPassword() {

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.get('email')?.markAsDirty();
      return;
    }

    this.forgotService.forgotPassword(this.forgotPasswordForm.value).subscribe({next:(data) => {
      //console.log(data);
      //localStorage.setItem("logintoken",data.data.token.accessToken )
      if(data.statusCode == 200 && data.success){
        this.router.navigateByUrl('/login');
        this.toastr.success("Please check your email and verify it to create a new password.");
      }
    },
    error:(error)=>{
      this.toastr.error(error.error.message);
    }
  });
  }

  resetBox() {
    this.forgotPasswordForm.reset();
  }

}
