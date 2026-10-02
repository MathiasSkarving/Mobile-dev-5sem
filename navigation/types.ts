import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Car } from '../db/types';

// Each tab has its own stack, so the tab params are the params for the nested stack
export type RootTabParamList = {
  SearchTab: NavigatorScreenParams<CarsStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList> | undefined;
};

export type ProfileStackParamList = {
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
  Verification: undefined;
};

export type CarsStackParamList = {
  Search: undefined;
  // Dates are passed as ISO strings, since navigation params should be serializable
  Checkout: { car: Car; imageUrl?: string; startDate?: string; endDate?: string };
  CarDetails: { car: Car; imageUrl?: string; startDate?: string; endDate?: string };
};

export type BookingsStackParamList = {
  Bookings: undefined;
};

// For screens that also navigate to other tabs
export type CarsTabScreenProps<T extends keyof CarsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<CarsStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;
