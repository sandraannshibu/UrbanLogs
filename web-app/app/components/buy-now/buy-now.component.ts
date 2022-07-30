import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProduct } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss'],
})
export class BuyNowComponent implements OnInit {
  products: IProduct[] = [];
  total: number = 0;

  constructor(
    private dialogRef: MatDialogRef<BuyNowComponent>,
    private auth: Auth,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) data: { products: IProduct[]; total: number }
  ) {
    this.products = data.products;
    this.total = data.total;
  }

  ngOnInit(): void {}

  close()
  {
    this.dialogRef.close()
  }
}
