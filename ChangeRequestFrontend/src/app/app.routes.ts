import { Routes } from '@angular/router';
import { RequestsComponent } from '../components/requests/requests.component';
import { CreateuserComponent } from '../components/createuser/createuser.component';
import { LoginComponent } from '../components/login/login.component';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
 { path: 'requests', component: RequestsComponent },
 { path: 'createUser', component: CreateuserComponent },
 { path: 'login', component: LoginComponent },
];
