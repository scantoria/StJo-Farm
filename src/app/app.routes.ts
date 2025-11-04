import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AnimalsComponent } from './pages/animals/animals.component';
import { ForSaleComponent } from './pages/for-sale/for-sale.component';
import { CalfAdoptionComponent } from './pages/calf-adoption/calf-adoption.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'animals', component: AnimalsComponent },
  { path: 'for-sale', component: ForSaleComponent },
  { path: 'calf-adoption', component: CalfAdoptionComponent },
  { path: 'contact', component: ContactComponent },
  { 
    path: 'admin', 
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];