import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hdev-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  loginForm !: FormGroup;

  constructor(private fb : FormBuilder, private loginService : LoginService, private router : Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    
    this.loginForm = this.fb.group({
      email : ['', [Validators.pattern(this.emailPattern)]],
      password : [''],
      platform:['web'],
  });
  }

  logging() {
    this.loginService.login(this.loginForm.value).subscribe({next:(data) => {
      //console.log(data);
      localStorage.setItem("logintoken",data.data.token.accessToken )
      if(data.statusCode == 200 && data.success){
        this.router.navigateByUrl('/dashboard/category');
        this.toastr.success('Logged In Successfully');
      }
    },
    error:(error)=>{
      this.toastr.error(error.error.message);
    }
  });
  }

  hidepassword: boolean = true;
  togglePassword() {
    this.hidepassword = !this.hidepassword;
  }


}

