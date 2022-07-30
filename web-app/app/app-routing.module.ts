import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './screen/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './screen/home/home.component';
import { NotFoundComponent } from './screen/not-found/not-found.component';
import { HomeBodyComponent } from './components/home-body/home-body.component';
import { CustomizationComponent } from './screen/customization/customization.component';
import { ContactComponent } from './screen/contact/contact.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'register',
        pathMatch: 'full',
        component: RegisterComponent,
      },
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'prefix',
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomeBodyComponent,
        pathMatch: 'full',
      },
      {
        path: 'customize',
        component: CustomizationComponent,
        pathMatch: 'full',
      },
      {
        path: 'contact',
        component: ContactComponent,
        pathMatch: 'full',
      },
      {
        path: 'category/:type',
        component: CategoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'product/:id',
        component: ProductViewComponent,
        pathMatch: 'full',
      },
      {
        path: 'cart',
        component: CartComponent,
        pathMatch: 'full',
      },
      {
        path: 'search',
        component: SearchComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '404',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
