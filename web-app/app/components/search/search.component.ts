import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getDatabase, get, ref } from '@angular/fire/database';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  maxPrice = 0;
  minPrice = Number.MAX_VALUE;
  value = 0;
  products: IProduct[] = [];
  _products: IProduct[] = [];
  title = '';

  constructor(private authService: AuthService, private auth: Auth) {
    this.authService.showProgress();
    const db = getDatabase();
    get(ref(db, 'products'))
      .then((p) => {
        this.products = [];
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

            var actualPrice =
              discount > 0 ? price - (discount * price) / 100 : price;

            if (this.maxPrice < actualPrice) {
              this.maxPrice = actualPrice;
            }

            if (this.minPrice > actualPrice) {
              this.minPrice = actualPrice;
            }

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

            this._products.push({
              id: key,
              coverImage: coverImg,
              price: price,
              qrCode: qr,
              tag: tag,
              title: title,
              images: imgs,
              discount: discount,
            });

            this.title = 'Showing ' + this.products.length + ' items';
          });
          this.value = this.maxPrice;
          this.authService.hideProgress();
        }
      })
      .catch((err) => {
        this.authService.hideProgress();
      });
  }

  ngOnInit(): void {}

  searchFor(val: string, priceLimit: number) {
    console.log('val ', val);

    this.products = [];
    if (val == '') {
      this._products.forEach((product) => {
        var actualPrice =
          product.discount > 0
            ? product.price - (product.discount * product.price) / 100
            : product.price;
        if (actualPrice <= this.value) {
          this.products.push(product);
        }
      });
      this.title = 'Showing ' + this.products.length + ' items';
    } else {
      this._products.forEach((product) => {
        var actualPrice =
          product.discount > 0
            ? product.price - (product.discount * product.price) / 100
            : product.price;

        if (
          (product.title.toLowerCase().includes(val.toLowerCase()) ||
            product.tag.includes(val.toLowerCase()) ||
            product.tag.includes(val.toUpperCase())) &&
          actualPrice <= this.value
        ) {
          this.products.push(product);
        }
      });
      this.title = 'Showing ' + this.products.length + ' items';
    }
  }
}
