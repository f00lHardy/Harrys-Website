
export interface Special {
  id: number;
  image: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Subcategory {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
  description: string;
  subcategories: Subcategory[];
}


export interface GalleryItem {
  src: string;
  alt: string;
  category: 'store' | 'staff' | 'products' | 'brands';
}

export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
}
