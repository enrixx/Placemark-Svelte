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

export interface PlacemarkImage {
  _id?: string;
  url: string;
  publicId: string;
  uploaderId: string;
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
  images?: PlacemarkImage[];
  categoryId?: string;
  userid?: string;
}

export interface Category {
  _id?: string;
  name: string;
}

export type WeatherDaily = {
  time: string[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_sum?: number[];
  precipitation_probability_max?: number[];
  windspeed_10m_max?: number[];
  windgusts_10m_max?: number[];
  winddirection_10m_dominant?: number[];
};

export type WeatherResponse = {
  daily?: WeatherDaily;
  daily_units?: Record<string, string>;
  hourly?: {
    time: string[];
    windspeed_10m?: number[];
  };
  hourly_units?: Record<string, string>;
};

export type ChartDataset = {
  name: string;
  values: number[];
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};