import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getDatabase, ref, remove } from '@firebase/database';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() products: IProduct[] = [];
  @Input() title = '';
  @Input() isCart = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private auth: Auth
  ) {}

  viewProduct(id: string) {
    this.router.navigate(['product/' + id]);
  }

  ngOnInit(): void {}

  remove(id: string) {
    const db = getDatabase();
    const uid = this.authService.getUserIdFromToken();
    remove(ref(db, 'Users/' + uid + '/cart/' + id));
  }
}
