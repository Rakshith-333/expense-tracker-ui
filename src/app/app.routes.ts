import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { Dashboard } from './components/dashboard/dashboard';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full',
    },
    {
        path: 'login', component: Login, canActivate: [guestGuard]
    },
    {
        path: 'register', component: Register, canActivate: [guestGuard]
    },
    {
        path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuard]
    },
    {
        path: 'dashboard', component: Dashboard, canActivate: [authGuard]
    }
];
