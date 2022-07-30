import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { get, getDatabase, onValue, ref, update } from '@angular/fire/database';
import { Router } from '@angular/router';
import { CarouselAction, ICarouselEmitter } from 'src/app/model/carousel';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home-body',
  templateUrl: './home-body.component.html',
  styleUrls: ['./home-body.component.scss'],
})
export class HomeBodyComponent implements OnInit {
  products: IProduct[] = [];
  latestProducts: IProduct[] = [];
  todaysDeal: IProduct[] = [];
  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.showProgress();
    const db = getDatabase();
    get(ref(db, 'products'))
      .then((p) => {
        if (p.exists()) {
          p.forEach((child) => {
            var key = child.key || '';
            var coverImg = child.child('cover_image').val();
            var price = child.child('price').val();
            var qr = child.child('qr').val();
            var tag = child.child('tag').val().split('#');
            var title = child.child('title').val();
            var discount = child.child('discount').val();
            var imgs: string[] = [];
            child.child('images').forEach((img) => {
              imgs.push(img.val());
            });
            this.products.push({
              id: key,
              coverImage: coverImg,
              price: price,
              qrCode: qr,
              tag: tag,
              title: title,
              images: imgs,
              discount: discount,
            });
          });

          var latestProductsIds: string[] = [];
          while (this.latestProducts.length < 10) {
            const i = Math.floor(Math.random() * this.products.length);
            var product = this.products[i];
            if (
              !latestProductsIds.includes(product.id) &&
              product.discount == 0
            ) {
              latestProductsIds.push(product.id);
              this.latestProducts.push(product);
            }
          }

          this.products.forEach((product) => {
            if (product.discount > 0) {
              this.todaysDeal.push(product);
            }
          });

          this.authService.hideProgress();
        }
      })
      .catch((err) => {
        this.authService.showProgress();
      });
  }

  handleCarouselClick(carousel: ICarouselEmitter) {
    console.log('id ' + carousel.id, 'type: ', carousel.type);
    if (carousel.type == CarouselAction.LEARN_MORE) {
      this.router.navigate(['product/' + carousel.id]);
    } else if (carousel.type == CarouselAction.ADD_TO_CART) {
      this.authService.showProgress();
      const uid = this.authService.getUserIdFromToken();

      update(ref(getDatabase(), 'Users/' + uid + '/cart'), {
        [carousel.id]: new Date().getTime(),
      })
        .then((res) => {
          alert('Product added to cart');
          this.authService.hideProgress();
        })
        .catch((err) => {
          alert('Failed to add product to cart');
          this.authService.hideProgress();
        });
    }
  }
}
