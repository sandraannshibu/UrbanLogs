import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  getCategory,
  INavigationEvent,
  INavigationIcon,
  INavigationLinkCollection,
} from 'src/app/model/toolbar';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  homeNavigationIcons: INavigationIcon[] = [
    {
      icon: 'search',
      badgeCount: 0,
      event: INavigationEvent.SEARCH,
    },
    {
      icon: 'shopping_cart',
      badgeCount: 0,
      event: INavigationEvent.CART,
    },
    {
      icon: 'logout',
      badgeCount: 0,
      event: INavigationEvent.SIGN_OUT,
    },
  ];

  homeNavigationCollection: INavigationLinkCollection[] = [
    {
      title: INavigationEvent[INavigationEvent.FURNITURES],
      event: INavigationEvent.FURNITURES,
      subUrls: [
        {
          title: 'Chairs',
          event: INavigationEvent.CHAIRS,
        },
        {
          title: 'Sofas & Recliners ',
          event: INavigationEvent.SOFAS,
        },
        {
          title: 'Tables',
          event: INavigationEvent.TABLES,
        },
        {
          title: 'Beds',
          event: INavigationEvent.BEDS,
        },
        {
          title: 'Cabinets',
          event: INavigationEvent.CABINETS,
        },
      ],
    },
    {
      title: INavigationEvent[INavigationEvent.DECORS],
      event: INavigationEvent.DECORS,
      subUrls: [],
    },
    {
      title: INavigationEvent[INavigationEvent.SANSKRITI],
      event: INavigationEvent.SANSKRITI,
      subUrls: [],
    },
    {
      title: INavigationEvent[INavigationEvent.CUSTOMIZATION],
      event: INavigationEvent.CUSTOMIZATION,
      subUrls: [],
    },
    {
      title: 'About Us',
      event: INavigationEvent.CONTACT,
      subUrls: [],
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  handleNavigationEvents(event: number) {
    switch(event)
    {
      case INavigationEvent.SIGN_OUT: {
        this.authService.signOut();
        return;
      }
      case INavigationEvent.CUSTOMIZATION: {
        this.router.navigate(['customize']);
        return;
      }
      case INavigationEvent.CONTACT: {
        this.router.navigate(['contact']);
        return;
      }
      case INavigationEvent.HOME: {
        this.router.navigate(['']);
        return;
      }
      case INavigationEvent.CHAIRS: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.BEDS: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.SOFAS: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.TABLES: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.CABINETS: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.FURNITURES: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.SANSKRITI: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.DECORS: {
        this.router.navigate(['category/'+getCategory(event)]);
        return;
      }
      case INavigationEvent.CART: {
        this.router.navigate(['cart']);
        return;
      }
      case INavigationEvent.SEARCH: {
        this.router.navigate(['search']);
        return;
      }
    }
    console.log('nav  ' + event);
  }

  handleCarouselClick(index: number) {
    console.log('carousel ' + index);
  }
}
