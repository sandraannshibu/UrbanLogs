import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HomeComponent } from './screen/home/home.component';
import { NotFoundComponent } from './screen/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCarouselModule } from 'ng-mat-carousel';
import { CarouselComponent } from './components/carousel/carousel.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../main';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AuthComponent } from './screen/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadScreenComponent } from './components/load-screen/load-screen.component';
import { CustomizationComponent } from './screen/customization/customization.component';
import { HomeBodyComponent } from './components/home-body/home-body.component';
import { ContactComponent } from './screen/contact/contact.component';
import { ProductComponent } from './components/product/product.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { BuyNowComponent } from './components/buy-now/buy-now.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchComponent } from './components/search/search.component';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    HomeComponent,
    NotFoundComponent,
    CarouselComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    LoadScreenComponent,
    CustomizationComponent,
    HomeBodyComponent,
    ContactComponent,
    ProductComponent,
    CategoryComponent,
    ProductViewComponent,
    BuyNowComponent,
    CartComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    NgxQRCodeModule,
    MatSliderModule,
    MatCarouselModule.forRoot(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
