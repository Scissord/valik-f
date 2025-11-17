/**
 * Base repository interface and implementation
 */
import { HttpClient } from '../http/http-client';
import { PaginatedResponse, PaginationParams } from '../../types/common.types';

export interface IBaseRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  findAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;
  findById(id: string): Promise<T | null>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> 
  implements IBaseRepository<T, TCreate, TUpdate> {
  
  protected abstract readonly endpoint: string;
  
  constructor(protected readonly httpClient: HttpClient) {}

  async findAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const response = await this.httpClient.get<PaginatedResponse<T>>(
      `${this.endpoint}?${queryParams.toString()}`
    );
    
    return response.data;
  }

  async findById(id: string): Promise<T | null> {
    try {
      const response = await this.httpClient.get<T>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }

  async create(data: TCreate): Promise<T> {
    const response = await this.httpClient.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: TUpdate): Promise<T> {
    const response = await this.httpClient.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.httpClient.delete(`${this.endpoint}/${id}`);
      return true;
    } catch (_error) {
      return false;
    }
  }
}
