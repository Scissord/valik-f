export interface GoodCategory {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  children?: GoodCategory[];
  totalProductCount?: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  _count?: {
    goods: number;
  };
}