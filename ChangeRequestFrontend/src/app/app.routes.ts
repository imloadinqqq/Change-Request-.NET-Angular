import { Routes } from '@angular/router';
import { RequestsComponent } from '../components/requests/requests.component';
import { CreateuserComponent } from '../components/createuser/createuser.component';
import { LoginComponent } from '../components/login/login.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
 { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
 { path: 'requests', component: RequestsComponent },
 { path: 'createUser', component: CreateuserComponent },
 { path: 'login', component: LoginComponent },
];
