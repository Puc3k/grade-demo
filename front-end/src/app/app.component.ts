import {Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {GradeFormComponent} from './grade-form/grade-form.component';
import {AuthService} from './auth.service';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    mat-toolbar {
      display: flex;
      justify-content: space-between;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  canAddGrade(): boolean {
    const userRoles = this.authService.getUserRoles();
    if (userRoles) {
      return userRoles.some(role => role === 'ROLE_TEACHER' || role === 'ROLE_ADMIN');
    }
    return false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAddGrade() {
    const dialogRef = this.dialog.open(GradeFormComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
