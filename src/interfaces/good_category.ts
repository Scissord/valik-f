export interface GoodCategory {
  id: number;
  name: string;
  parent_id: number | null;
  children?: GoodCategory[];
  totalProductCount?: number;
  _count: {
    goods: number;
  };
}