import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClient],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {
  email = '';
  password = '';

  message = '';
  isRegistering = false;

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private router: Router, private http: HttpClient) {}

 login() {
    this.message = '';

    this.http.post<any>(`${this.apiUrl}/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Fine for a quick testing/demo setup.
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

    this.http.post<any>(`${this.apiUrl}/register`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.message = 'Account created! You can now log in.';
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