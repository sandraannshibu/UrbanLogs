import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getDatabase, get, ref } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  category = '';
  _category = ''
  categoryProducts: IProduct[] = [];

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    
    this.activatedRoute.paramMap.subscribe((e) => {
      this._category = this.activatedRoute.snapshot.params['type'];
      this.category = this._category.split('_').join(' ')
      this.authService.showProgress();
      const db = getDatabase();
      get(ref(db, 'products'))
        .then((p) => {
          this.categoryProducts = [];
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

              if (tag.includes(this._category)) {
                this.categoryProducts.push({
                  id: key,
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
            this.authService.hideProgress();
          }
        })
        .catch((err) => {
          this.authService.hideProgress();
        });
    });
  }
  ngOnInit(): void {}
}
