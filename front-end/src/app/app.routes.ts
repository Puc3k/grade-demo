import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {GradeListComponent} from './grade-list/grade-list.component';
import {GradeFormComponent} from './grade-form/grade-form.component';
import {AuthGuard} from "./auth.guard";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'grades',
    component: GradeListComponent,
    canActivate: [AuthGuard],
    data: {roles: ['ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_ADMIN']}
  },
  {
    path: 'grades/new',
    component: GradeFormComponent,
    canActivate: [AuthGuard],
    data: {roles: ['ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_ADMIN']}
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login'}
];
