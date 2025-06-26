import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TaskComponent } from './task/task.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'task', component: TaskComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'login' }
];
