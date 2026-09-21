
export type Car = {
    id: number;
    carName: string;
    pricePerDay: number;
};

export type NewCar = Omit<Car, "id">;

export type Table = "Cars"