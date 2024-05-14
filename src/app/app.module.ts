import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CategoryComponent } from './category/category.component';
import { StoreComponent } from './store/store.component';
import { DiscountComponent } from './discount/discount.component';
import { CustomersComponent } from './customers/customers.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { appConfig, appServiceConfig } from './AppConfig/appConfig.service';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { herosInterceptor } from './heros.interceptor';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { JsonPipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CategoryComponent,
    StoreComponent,
    DiscountComponent,
    CustomersComponent,
    NavbarComponent,
    ProfileComponent,
    ChangepasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbAlertModule,
    FormsModule,
    JsonPipe
  ],
  providers: [
    {
      provide: appServiceConfig,
      useValue: appConfig
    },
    provideHttpClient(
      withInterceptors([
        herosInterceptor,
        (req, next) => next(req),
      ]),
    ),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
