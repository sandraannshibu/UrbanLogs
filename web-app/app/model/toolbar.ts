export enum INavigationEvent {
  HOME = 1,
  FURNITURES = 2,
  CHAIRS = 3,
  BEDS = 4,
  SOFAS = 5,
  TABLES = 6,
  CABINETS = 7,
  CUSTOMIZATION = 8,
  CONTACT = 9,
  SEARCH = 10,
  CART = 12,
  SIGN_OUT = 13,
  DECORS = 14,
  SANSKRITI = 15
}

export function getCategory(type: INavigationEvent){

  switch(type){
    case 3: return 'chairs';
    case 4: return 'beds';
    case 5: return 'sofas_and_recliners';
    case 6: return 'tables';
    case 7: return 'cabinets';
    case 14: return 'decors';
    case 15: return 'sanskriti';
    default: return 'furniture';
  }

}

export interface INavigationLink {
  title: string;
  event: INavigationEvent;
}

export interface INavigationLinkCollection {
  title: string;
  event: INavigationEvent;
  subUrls: INavigationLink[];
}

export interface INavigationIcon{
  icon: string;
  badgeCount: number;
  event: INavigationEvent;
}