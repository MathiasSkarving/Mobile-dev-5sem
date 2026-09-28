
export type Car = {
    id: number;
    make: string;
    model: string;
    price_per_day: number;
    electric: boolean;
};

export type CarImage = {
    id: number;
    url: string;
    car_id: number;
};

export type NewCar = Omit<Car, "id">;
export type NewCarImage = Omit<CarImage, "id">;

export type CarsTable = "Cars"
export type ImagesTable = "Images"