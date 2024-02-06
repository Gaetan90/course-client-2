import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClassComponent } from './components/class/add-class/add-class.component';
import { AddCourseComponent } from './components/class/add-course/add-course.component';
import { ClassDetailsComponent } from './components/class/class-details/class-details.component';
import { CourseComponent } from './components/class/course/course.component';
import { InvoicePdfComponent } from './components/class/invoice-pdf/invoice-pdf.component';
import { AddAddressComponent } from './components/client/add-address/add-address.component';
import { AddClientComponent } from './components/client/add-client/add-client.component';
import { AddStudentComponent } from './components/client/add-student/add-student.component';
import { ClientDetailComponent } from './components/client/client-detail/client-detail.component';
import { ClientComponent } from './components/client/client.component';
import { UpdateStudentComponent } from './components/client/update-student/update-student.component';
import { InspectionsComponent } from './components/inspections/inspections.component';
import { LoginComponent } from './components/login/login.component';
import { ClientTypeComponent } from './components/settings/client-type/client-type.component';
import { CourseCategoryComponent } from './components/settings/coursecategory/coursecategory.component';
import { StudentTitleComponent } from './components/settings/student-title/student-title.component';
import { StudentTypeComponent } from './components/settings/student-type/student-type.component';
import { TeachingModeComponent } from './components/settings/teaching-mode/teaching-mode.component';
import { ResetPasswordComponent } from './components/settings/user/reset-password/reset-password.component';
import { UserComponent } from './components/settings/user/user.component';
import { StaffMembersComponent } from './components/staff-members/staff-members.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { ClassComponent } from './components/class/class.component';


export const routes: Routes = [
    { path: '',      component: ClassComponent , canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent  },
  
    /* Client */
    { path: 'clients', component: ClientComponent , canActivate: [AuthGuard] },
    { path: 'client/newclient', component: AddClientComponent , canActivate: [AuthGuard] },
    { path: 'client/:id', component: ClientDetailComponent , canActivate: [AuthGuard] },
    { path: 'client/:id/addstudent', component: AddStudentComponent , canActivate: [AuthGuard] },
    { path: 'client/updatestudent/:id', component: UpdateStudentComponent , canActivate: [AuthGuard] },
    { path: 'client/addaddress/:id', component: AddAddressComponent , canActivate: [AuthGuard] },
  
    /* Courses */
    { path: 'courses', component: CourseComponent , canActivate: [AuthGuard] },
    { path: 'courses/newcourse', component: AddCourseComponent , canActivate: [AuthGuard] },
  
    /* Class */
    { path: 'classes', component: ClassComponent , canActivate: [AuthGuard] },
    { path: 'class/newclass', component: AddClassComponent , canActivate: [AuthGuard] },
    { path: 'class/:id', component: ClassDetailsComponent , canActivate: [AuthGuard] },
  
    { path: 'invoicepdf/:id', component: InvoicePdfComponent , canActivate: [AuthGuard] },
  
    { path: 'settings/coursecategories', component: CourseCategoryComponent , canActivate: [AuthGuard] },
    { path: 'settings/clienttypes', component: ClientTypeComponent , canActivate: [AuthGuard] },
    { path: 'settings/teachingmodes', component: TeachingModeComponent , canActivate: [AuthGuard] },
    { path: 'settings/studenttypes', component: StudentTypeComponent , canActivate: [AuthGuard] },
    { path: 'settings/studenttitles', component: StudentTitleComponent , canActivate: [AuthGuard] },
    { path: 'settings/users', component: UserComponent , canActivate: [AuthGuard, AdminGuard] },
    { path: 'settings/user/:id', component: ResetPasswordComponent , canActivate: [AuthGuard, AdminGuard] },
  
    { path: 'inspections', component: InspectionsComponent , canActivate: [AuthGuard] },
    { path: 'test', component: InspectionsComponent , canActivate: [AuthGuard] },
  
   //Staff members
    { path: 'staffmembers', component: StaffMembersComponent , canActivate: [AuthGuard] },
  
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
