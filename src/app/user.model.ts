export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface UserContact extends User {
  phone: string;
  address: string;
  city: string;
  country: string;
}
