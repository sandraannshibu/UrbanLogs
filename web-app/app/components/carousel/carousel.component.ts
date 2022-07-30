import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { get, getDatabase, ref } from '@angular/fire/database';
import {
  CarouselAction,
  ICarouselEmitter,
  ICarouselSlide,
} from 'src/app/model/carousel';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  @Output() carouselEmitter = new EventEmitter<ICarouselEmitter>();

  slideActions = CarouselAction;
  slides: ICarouselSlide[] = [];
  carouselKeys =[]

  constructor(private authService: AuthService, private auth: Auth) {
    const db = getDatabase();
    get(ref(db, 'products')).then((snap) => {
      if (snap.exists()) {
        this.authService.showProgress();
        snap.forEach((child) => {
          var key = child.key || '';
          var coverImg = child.child('cover_image').val();
          var tag = child.child('tag').val().split('#');
          if (tag.includes('carousel')) {
            console.log("carsouel ",key);
            
            this.slides.push({
              image: coverImg,
              id: key,
            });
          }
        });
        this.authService.hideProgress();
      }
    });
  }

  ngOnInit(): void {}

  handleCarouselClick(id: string, type: CarouselAction) {
    this.carouselEmitter.emit({
      id: id,
      type: type,
    });
  }
}
