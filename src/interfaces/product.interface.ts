export interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  quantity: number;
  articul: string;
  supplier_id?: number;
  brand_id: number;
  category_id: number;
  unit_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

 
  brand?: string;
  category?: string;
  unit?: string;
  rating?: number;
  slug?: string;
}

export interface CartProduct{
  id: string;
  slug:string;
  title: string;
  price: number;
  quantity: number;
  images: string;
}

export interface ProductImage{
  id:number,
  url:string
}
