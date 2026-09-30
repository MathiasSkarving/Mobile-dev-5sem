import { Car } from '../db/types';

export type ProfileStackParamList = {
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
  Verification: undefined;
};

export type CarsStackParamList = {
  Search: undefined;
  Cars: undefined;
  // Dates are passed as ISO strings, since navigation params should be serializable
  Checkout: { car: Car; imageUrl?: string; startDate?: string; endDate?: string };
  CarDetails: { car: Car; imageUrl?: string; startDate?: string; endDate?: string };
};

export type BookingsStackParamList = {
  Bookings: undefined
}