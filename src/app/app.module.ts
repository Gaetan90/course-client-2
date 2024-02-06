import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { ClientComponent, DialogDeleteClient } from './components/client/client.component';


import { MatButtonModule  } from '@angular/material/button';

import { MatInputModule  } from '@angular/material/input';

import { MatTableModule  } from '@angular/material/table';
import { MatPaginatorModule  } from '@angular/material/paginator';
import { MatSortModule  } from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';



import { ClientDetailComponent, DialogDeleteStudent } from './components/client/client-detail/client-detail.component';
import { ClientService } from './services/client.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { LoaderInterceptor } from './services/loaderInterceptor'

import { AddClientComponent } from './components/client/add-client/add-client.component';
import { CourseService } from './services/course.service';
import { AddCourseComponent } from './components/class/add-course/add-course.component';
import { CourseComponent } from './components/class/course/course.component';
import { UpdateCourseComponent } from './components/class/update-course/update-course.component';
import { AddStudentComponent } from './components/client/add-student/add-student.component';
import { UpdateStudentComponent } from './components/client/update-student/update-student.component';
import { ClassComponent, DialogDeleteClass } from './components/class/class.component';
import { AddClassComponent } from './components/class/add-class/add-class.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ClassDetailsComponent, DialogCertificateName } from './components/class/class-details/class-details.component';
import { InvoicePdfComponent } from './components/class/invoice-pdf/invoice-pdf.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { InvoiceComponent } from './components/class/invoice/invoice.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ArraySortPipeASC, ArraySortPipeDESC,  SortByDatePipe } from './Pipes/ArraySortPipe ';

import {OverlayModule} from '@angular/cdk/overlay';
import { AddAddressComponent } from './components/client/add-address/add-address.component';
import { CourseCategoryComponent } from './components/settings/coursecategory/coursecategory.component';
import { UpdateCoursecategoryComponent } from './components/settings/coursecategory/update-coursecategory/update-coursecategory.component';
import { AddCourseCategoryComponent } from './components/settings/coursecategory/add-course-category/add-course-category.component';
import { TeachingModeComponent } from './components/settings/teaching-mode/teaching-mode.component';
import { AddTeachingModeComponent } from './components/settings/teaching-mode/add-teaching-mode/add-teaching-mode.component';
import { UpdateTeachingModeComponent } from './components/settings/teaching-mode/update-teaching-mode/update-teaching-mode.component';
import { ClientTypeComponent } from './components/settings/client-type/client-type.component';
import { AddClientTypeComponent } from './components/settings/client-type/add-client-type/add-client-type.component';
import { UpdateClientTypeComponent } from './components/settings/client-type/update-client-type/update-client-type.component';
import { StudentTypeComponent } from './components/settings/student-type/student-type.component';
import { UpdateStudentTypeComponent } from './components/settings/student-type/update-student-type/update-student-type.component';
import { AddStudentTypeComponent } from './components/settings/student-type/add-student-type/add-student-type.component';
import { StudentTitleComponent } from './components/settings/student-title/student-title.component';
import { AddStudentTitleComponent } from './components/settings/student-title/add-student-title/add-student-title.component';
import { UpdateStudentTitleComponent } from './components/settings/student-title/update-student-title/update-student-title.component';
import { LoginComponent } from './components/login/login.component';
import { JwtInterceptor } from './auth/guards/jwt.interceptor';
import { UserComponent } from './components/settings/user/user.component';
import { AddUserComponent } from './components/settings/user/add-user/add-user.component';
import { UpdateUserComponent } from './components/settings/user/update-user/update-user.component';
import { ResetPasswordComponent } from './components/settings/user/reset-password/reset-password.component';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CallbackPipe } from './Pipes/callback.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClientDetailsComponent } from './components/client/client-details/client-details.component';


import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InspectionsComponent } from './components/inspections/inspections.component';
import { DialogEditComponent } from './components/inspections/dialog-edit/dialog-edit.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogAddComponent } from './components/inspections/dialog-add/dialog-add.component';
import { StaffMembersComponent } from './components/staff-members/staff-members.component';
import { PhoneMaskDirective } from './phone-mask.directive';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { matModules } from './material-module';
import { SettingsService } from './services/settings.service';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppRoutingModule } from './app-routing.module';

//import { AddClassTypeComponent } from './add-class-type/add-class-type.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    ClientDetailComponent,
    AddClientComponent,
    AddCourseComponent,
    CourseComponent,
    UpdateCourseComponent,
    AddStudentComponent,
    UpdateStudentComponent,
    ClassComponent,
    AddClassComponent,
    ClassDetailsComponent,
    DialogDeleteClass,
    DialogDeleteStudent,
    DialogDeleteClient,
    InvoicePdfComponent,
    LoaderComponent,
    InvoiceComponent,
    ArraySortPipeASC,
    ArraySortPipeDESC,
    SortByDatePipe,
    CallbackPipe,
    PhoneMaskDirective,
    AddAddressComponent,
    CourseCategoryComponent,
    UpdateCoursecategoryComponent,
    AddCourseCategoryComponent,
    AddCourseCategoryComponent,
    TeachingModeComponent,
    AddTeachingModeComponent,
    UpdateTeachingModeComponent,
    ClientTypeComponent,
    AddClientTypeComponent,
    UpdateClientTypeComponent,
    StudentTypeComponent,
    UpdateStudentTypeComponent,
    AddStudentTypeComponent,
    StudentTitleComponent,
    AddStudentTitleComponent,
    UpdateStudentTitleComponent,
    LoginComponent,
    UserComponent,
    AddUserComponent,
    UpdateUserComponent,
    ResetPasswordComponent,
    CallbackPipe,
    ClientDetailsComponent,
    InspectionsComponent,
    DialogEditComponent,
    DialogCertificateName,
    DialogAddComponent,
    StaffMembersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatIconModule,
    MatBadgeModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    BrowserModule,
    MatDialogModule,
    OverlayModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatListModule,
    MatBadgeModule,
    MatProgressBarModule,
   // OwlDateTimeModule,
   // OwlNativeDateTimeModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    ClientService
    , CourseService
    , LoaderService
    , { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
    , { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

  ],
  exports: [
    PhoneMaskDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
