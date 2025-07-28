export interface User {
    id:        number;
    email:     string;
    full_name: string;
    login:     string;
    phone?:    string | null;
    birth_date?: number | null;
    gender?:    string | null;
    address?:  string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  }
  
  export interface UserLogin {
    login:      string;
    password:   string;
  }
  
  export interface UserRegister {
    email:      string;
    password:   string;
    full_name:  string;
    login:      string;
    phone?:     string;
    gender?:    string;
  }
  
