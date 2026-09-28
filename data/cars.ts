import carsJson from './cars.json';

export type Car = {
    id: string;
    name: string;
    pricePerDay: number; 
    image: string;       
};

export const CARS: Car[] = carsJson;