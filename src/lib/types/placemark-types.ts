export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface Placemark {
  _id?: string;
  name: string;
  categoryName: string;
  description?: string;
  longitude: number;
  latitude: number;
  img?: string | null;
  imgPublicId?: string | null;
  categoryId?: string;
  userid?: string;
}

export interface Category {
  _id?: string;
  name: string;
}
