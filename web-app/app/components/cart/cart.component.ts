import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { get, getDatabase, onValue, ref } from '@angular/fire/database';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { BuyNowComponent } from '../buy-now/buy-now.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartProducts: IProduct[] = [];
  total = 0;

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
    private dialog: MatDialog
  ) {
    const db = getDatabase();
    const uid = this.authService.getUserIdFromToken();

    onValue(ref(db, 'Users/' + uid + '/cart'), (snap) => {
      var userProductKeys: string[] = [];
      this.cartProducts = []
      this.total = 0;
      if (snap.exists()) {
        snap.forEach((child) => {
          var key = child.key || '';
          userProductKeys.push(key);
        });

        get(ref(db, 'products'))
          .then((pr) => {
            if (pr.exists()) {
              pr.forEach((p) => {
                var pKey = p.key || '';

                if (userProductKeys.includes(pKey)) {
                  var coverImg = p.child('cover_image').val();
                  var price = p.child('price').val();
                  var qr = p.child('qr').val();
                  var tag = p.child('tag').val().split('#');
                  var title = p.child('title').val();
                  var discount = p.child('discount').val();
                  var imgs: string[] = [];

                  var actualPrice =
                    discount > 0 ? price - (discount * price) / 100 : price;
                  this.total += actualPrice;

                  p.child('images').forEach((img) => {
                    imgs.push(img.val());
                  });
                  this.cartProducts.push({
                    id: pKey,
                    coverImage: coverImg,
                    price: price,
                    qrCode: qr,
                    tag: tag,
                    title: title,
                    images: imgs,
                    discount: discount,
                  });
                }
              });
            }
          })
          .catch((err) => {
            this.authService.hideProgress();
          });

        this.authService.hideProgress();
      }
    });
  }

  ngOnInit(): void {}

  checkout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      'products':this.cartProducts,
      'total':this.total,
    }
    this.dialog.open(BuyNowComponent, dialogConfig);
  }
}
