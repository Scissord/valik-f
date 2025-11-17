/**
 * User repository implementation
 */
import { BaseRepository } from './base.repository';
import { HttpClient } from '../http/http-client';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthTokens,
  Address 
} from '../../types/domain/user.types';

export interface IUserRepository {
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;
  register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }>;
  getProfile(): Promise<User>;
  updateProfile(data: Partial<User>): Promise<User>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  logout(): Promise<void>;
  
  // Address management
  getAddresses(): Promise<Address[]>;
  createAddress(data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address>;
  updateAddress(id: string, data: Partial<Address>): Promise<Address>;
  deleteAddress(id: string): Promise<boolean>;
  setDefaultAddress(id: string): Promise<void>;
}

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  protected readonly endpoint = '/users';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.httpClient.post<{ user: User; tokens: AuthTokens }>(
      '/auth/login',
      credentials
    );
    return response.data;
  }

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.httpClient.post<{ user: User; tokens: AuthTokens }>(
      '/auth/register',
      data
    );
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.httpClient.get<User>('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.httpClient.put<User>('/auth/profile', data);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await this.httpClient.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.httpClient.post('/auth/logout');
  }

  // Address management
  async getAddresses(): Promise<Address[]> {
    const response = await this.httpClient.get<Address[]>('/users/addresses');
    return response.data;
  }

  async createAddress(data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    const response = await this.httpClient.post<Address>('/users/addresses', data);
    return response.data;
  }

  async updateAddress(id: string, data: Partial<Address>): Promise<Address> {
    const response = await this.httpClient.put<Address>(`/users/addresses/${id}`, data);
    return response.data;
  }

  async deleteAddress(id: string): Promise<boolean> {
    try {
      await this.httpClient.delete(`/users/addresses/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async setDefaultAddress(id: string): Promise<void> {
    await this.httpClient.patch(`/users/addresses/${id}/default`);
  }
}
