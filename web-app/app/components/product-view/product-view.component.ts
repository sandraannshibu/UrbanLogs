import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getDatabase, get, ref, update } from '@angular/fire/database';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { BuyNowComponent } from '../buy-now/buy-now.component';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  productId = '';
  product: IProduct = {
    id: '',
    qrCode: '',
    images: [],
    coverImage: '',
    title: '',
    price: 0,
    discount: 0,
    tag: [],
  };
  similarProducts: IProduct[] = [];

  title = 'angular10qrcodegeneration';

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.activatedRoute.paramMap.subscribe((e) => {
      this.productId = this.activatedRoute.snapshot.params['id'].trim();
      this.authService.showProgress();
      const db = getDatabase();
      get(ref(db, 'products/' + this.productId))
        .then((p) => {
          if (p.exists()) {
            var tagString = p.child('tag').val();
            var key = p.key || '';
            var coverImg = p.child('cover_image').val();
            var price = p.child('price').val();
            var qr = p.child('qr').val();
            var tag = tagString.split('#');
            var title = p.child('title').val();
            var discount = p.child('discount').val();
            var imgs: string[] = [];
            p.child('images').forEach((img) => {
              imgs.push(img.val());
            });

            this.value = qr;

            this.product = {
              id: key,
              coverImage: coverImg,
              price: discount > 0 ? price - (discount * price) / 100 : price,
              qrCode: qr,
              tag: tag,
              title: title,
              images: imgs,
              discount: discount,
            };


            this.authService.hideProgress();
          }
        })
        .catch((err) => {
          this.authService.hideProgress();
        });
    });
  }

  addToCart(key: string) {
    this.authService.showProgress();
    const uid = this.authService.getUserIdFromToken();

    update(ref(getDatabase(), 'Users/' + uid + '/cart'), {
      [key]: new Date().getTime(),
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

  checkout(product: IProduct) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      products: [product],
      total:
        product.discount > 0
          ? product.price - (product.price * product.discount) / 100
          : product.price,
    };
    this.dialog.open(BuyNowComponent, dialogConfig);
  }

  ngOnInit(): void {}
}
