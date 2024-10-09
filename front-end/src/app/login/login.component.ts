import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatToolbar,
    MatCardContent,
    MatCard,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel
  ]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/grades']);
    }
  }

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/grades']);
      },
      (error) => {
        this.errorMessage = 'Błędne dane logowania';
      }
    );
  }
}
