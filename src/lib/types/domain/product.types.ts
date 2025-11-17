/**
 * Product domain types
 */
import { BaseEntity } from '../common.types';

export interface Product extends BaseEntity {
  title: string;
  description: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  price: Price;
  category: ProductCategory;
  brand?: Brand;
  specifications: ProductSpecification[];
  images: ProductImage[];
  inventory: ProductInventory;
  seo: ProductSEO;
  status: ProductStatus;
  tags: string[];
  weight?: number;
  dimensions?: ProductDimensions;
}

export interface Price {
  current: number;
  original?: number;
  currency: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    validFrom?: string;
    validTo?: string;
  };
}

export interface ProductCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  seo: CategorySEO;
}

export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
  group?: string;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductInventory {
  quantity: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
}

export interface CategorySEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm' | 'mm';
}

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  addedAt: string;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  currency: string;
  updatedAt: string;
}

// Product filters
export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  tags?: string[];
  search?: string;
}
