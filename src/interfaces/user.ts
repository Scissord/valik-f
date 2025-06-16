export interface User {
  id: string;
  login: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  birth_date: number;
  gender: number;
  address: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
};

export interface UserLogin {
  login: string;
  password: string
};

