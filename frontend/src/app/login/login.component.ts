// features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'

})export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService,private router: Router) {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit() {
    this.auth.login(this.form.value).subscribe(res => {
      localStorage.setItem('token', res.token);
      alert('Login successful');
      this.router.navigate(['/task']);
    });
  }
}
