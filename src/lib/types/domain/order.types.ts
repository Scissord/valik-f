/**
 * Order domain types
 */
import { BaseEntity } from '../common.types';
import { User, Address } from './user.types';
import { Product } from './product.types';

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  items: OrderItem[];
  shipping: ShippingInfo;
  billing: BillingInfo;
  payment: PaymentInfo;
  totals: OrderTotals;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku: string;
  title: string;
  image?: string;
}

export interface ShippingInfo {
  method: ShippingMethod;
  address: Address;
  cost: number;
  estimatedDays: number;
  trackingNumber?: string;
}

export interface BillingInfo {
  address: Address;
  sameAsShipping: boolean;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  amount: number;
  currency: string;
  gateway?: string;
  gatewayResponse?: any;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 
  | 'card'
  | 'paypal'
  | 'bank_transfer'
  | 'cash_on_delivery'
  | 'wallet';

export type ShippingMethod = 
  | 'standard'
  | 'express'
  | 'overnight'
  | 'pickup';

// Order creation
export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId?: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  notes?: string;
  promoCode?: string;
}

// Order filters
export interface OrderFilters {
  status?: OrderStatus[];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentStatus?: PaymentStatus[];
}
