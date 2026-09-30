import { Car } from '../db/types';

export type ProfileStackParamList = {
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
};

export type CarsStackParamList = {
  Search: undefined;
  Cars: undefined;
  Bookings: undefined;
  // Dates are passed as ISO strings, since navigation params should be serializable
  Checkout: { car: Car; imageUrl?: string; startDate?: string; endDate?: string };
  CarDetails: { car: Car; imageUrl?: string; startDate?: string; endDate?: string };
};