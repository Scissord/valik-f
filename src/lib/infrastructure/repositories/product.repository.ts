/**
 * Product repository implementation
 */
import { BaseRepository } from './base.repository';
import { HttpClient } from '../http/http-client';
import { 
  Product, 
  ProductCategory, 
  ProductFilters,
  Brand 
} from '../../types/domain/product.types';
import { PaginatedResponse, PaginationParams } from '../../types/common.types';

export interface IProductRepository {
  findByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResponse<Product>>;
  findByFilters(filters: ProductFilters, params?: PaginationParams): Promise<PaginatedResponse<Product>>;
  search(query: string, params?: PaginationParams): Promise<PaginatedResponse<Product>>;
  getFeatured(limit?: number): Promise<Product[]>;
  getRelated(productId: string, limit?: number): Promise<Product[]>;
  
  // Categories
  getCategories(): Promise<ProductCategory[]>;
  getCategoryById(id: string): Promise<ProductCategory | null>;
  getCategoryBySlug(slug: string): Promise<ProductCategory | null>;
  
  // Brands
  getBrands(): Promise<Brand[]>;
  getBrandById(id: string): Promise<Brand | null>;
}

export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  protected readonly endpoint = '/products';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  async findByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    queryParams.append('categoryId', categoryId);
    
    if (params) {
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const response = await this.httpClient.get<PaginatedResponse<Product>>(
      `${this.endpoint}?${queryParams.toString()}`
    );
    return response.data;
  }

  async findByFilters(filters: ProductFilters, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    // Add filters
    if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
    if (filters.brandId) queryParams.append('brandId', filters.brandId);
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange.min.toString());
      queryParams.append('maxPrice', filters.priceRange.max.toString());
    }
    if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());
    if (filters.tags) {
      filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    if (filters.search) queryParams.append('search', filters.search);
    
    // Add pagination
    if (params) {
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const response = await this.httpClient.get<PaginatedResponse<Product>>(
      `${this.endpoint}?${queryParams.toString()}`
    );
    return response.data;
  }

  async search(query: string, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    queryParams.append('search', query);
    
    if (params) {
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const response = await this.httpClient.get<PaginatedResponse<Product>>(
      `${this.endpoint}/search?${queryParams.toString()}`
    );
    return response.data;
  }

  async getFeatured(limit = 10): Promise<Product[]> {
    const response = await this.httpClient.get<Product[]>(
      `${this.endpoint}/featured?limit=${limit}`
    );
    return response.data;
  }

  async getRelated(productId: string, limit = 5): Promise<Product[]> {
    const response = await this.httpClient.get<Product[]>(
      `${this.endpoint}/${productId}/related?limit=${limit}`
    );
    return response.data;
  }

  // Categories
  async getCategories(): Promise<ProductCategory[]> {
    const response = await this.httpClient.get<ProductCategory[]>('/categories');
    return response.data;
  }

  async getCategoryById(id: string): Promise<ProductCategory | null> {
    try {
      const response = await this.httpClient.get<ProductCategory>(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }

  async getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
    try {
      const response = await this.httpClient.get<ProductCategory>(`/categories/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const response = await this.httpClient.get<Brand[]>('/brands');
    return response.data;
  }

  async getBrandById(id: string): Promise<Brand | null> {
    try {
      const response = await this.httpClient.get<Brand>(`/brands/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }
}
