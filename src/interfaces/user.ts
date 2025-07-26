export interface User {
    id:        string;
    email:     string;
    name:      string;
    login:     string;
    phone?:    string | null;
  }
  
  export interface UserLogin {
    email:      string;
    password:   string;
  }
  
  export interface UserRegister {
    email:      string;
    password:   string;
    name:       string;
    login:      string;
    phone?:     string;
    gender?:    string;
  }
  
