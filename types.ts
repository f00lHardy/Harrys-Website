

export interface Special {
  id: number;
  image: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  image: string;
  description:string;
}

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
  description: string;
  subcategories: Subcategory[];
}


export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: 'store' | 'staff' | 'products' | 'brands';
}

export interface User {
  id: number;
  fullName: string;
  cellNumber: string;
  email: string;
  deliveryAddress: string;
  password: string;
  points: number;
}

export type SessionUser = Omit<User, 'password'>;

export interface GasOption {
  size: number;
  name: string;
  price: number;
  image: string;
}