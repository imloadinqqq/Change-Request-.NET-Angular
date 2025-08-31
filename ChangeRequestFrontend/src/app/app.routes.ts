import { Routes } from '@angular/router';
import { RequestsComponent } from '../components/requests/requests.component';
import { CreateuserComponent } from '../components/createuser/createuser.component';
import { LoginComponent } from '../components/login/login.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { UserviewComponent } from '../components/userview/userview.component';
import { NotfoundComponent } from '../components/notfound/notfound.component';
import { UserstatsComponent } from '../components/userstats/userstats.component';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
 { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
 { path: 'requests', component: RequestsComponent, canActivate: [authGuard] },
 { path: 'createUser', component: CreateuserComponent },
 { path: 'users', component: UserviewComponent, canActivate: [authGuard] },
 { path: 'userStats', component: UserstatsComponent, canActivate: [authGuard] },
 { path: 'login', component: LoginComponent },
 { path: '**', component: NotfoundComponent }
];
