import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Animals } from './pages/animals/animals';
import { ForSale } from './pages/for-sale/for-sale';
import { CalfAdoption } from './pages/calf-adoption/calf-adoption';
import { Contact } from './pages/contact/contact';
import { Admin } from './pages/admin/admin';
import { Login } from './pages/admin/login/login';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { AnimalOfMonthAdmin } from './pages/admin/animal-of-month/animal-of-month-admin';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'animals', component: Animals },
  { path: 'for-sale', component: ForSale },
  { path: 'calf-adoption', component: CalfAdoption },
  { path: 'contact', component: Contact },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
      },
      {
        path: 'animal-of-month',
        component: AnimalOfMonthAdmin,
        canActivate: [authGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];