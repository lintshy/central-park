export type Postcode = '2769' | '2762';

export interface PostcodeEntry {
  code: Postcode;
  label: string;
  latitude: number;
  longitude: number;
}

export interface NearbyResult {
  entry: PostcodeEntry;
  distanceKm: number;
}

export type Category = 'meals' | 'garage_sales' | 'activities';

export interface Suburb {
  name: string;
  postcode: Postcode;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  priceAud: number;
  thumbnailUrl?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  address: string;
  suburb: string;
  postcode: Postcode;
  category: Category;
  latitude: number;
  longitude: number;
  image?: string;
  date?: string;
  time?: string;
  price?: string;
  tags?: string[];
  host?: string;
  contact?: string;
  isAcceptingOrders?: boolean;
  menuItems?: MenuItem[];
}

export type RootStackParamList = {
  Home: undefined;
  Categories: { suburb: Suburb };
  Listings: { category: Category; suburb: Suburb };
  ListingDetail: { listing: Listing; accentColor: string };
  Profile: undefined;
};
