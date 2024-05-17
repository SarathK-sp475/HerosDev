import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { DiscountComponent } from './discount/discount.component';
import { LoginComponent } from './login/login.component';
import { StoreComponent } from './store/store.component';
import { CustomersComponent } from './customers/customers.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { loginGuard } from './guards/login.guard';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },

  { path: 'dashboard', canActivate: [loginGuard], component: NavbarComponent, children: [
      { path: '', redirectTo: 'category', pathMatch: 'full' }, // Redirect to category by default
      { path: 'category', component: CategoryComponent },
      { path: 'store', component: StoreComponent },
      { path: 'discount', component: DiscountComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'changePassword',component: ChangepasswordComponent }
    ]
  },
  
  { path: '', redirectTo: '/dashboard/category', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
