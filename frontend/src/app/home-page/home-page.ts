import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {
  email = '';
  password = '';

  message = '';
  isRegistering = false;

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

 login() {
    this.message = '';

    this.http.post<any>(`${this.apiUrl}/api/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);

        this.router.navigate(['hws']);
      },
      error: (error) => {
        console.error(error);
        this.message =
          error.error?.message || 'Login failed';
      }
    });
  }

  register() {
    this.message = '';

    this.http.post<any>(`${this.apiUrl}/api/auth/register`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.message = 'Account created!';
        this.isRegistering = false;
        this.password = '';
      },
      error: (error) => {
        console.error(error);
        this.message =
          error.error?.message || 'Registration failed';
      }
    });
  }

  submit() {
    if (this.isRegistering) {
      this.register();
    } else {
      this.login();
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.message = '';
  }
}