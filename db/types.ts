
export type Car = {
    id: number;
    make: string;
    model: string;
    price_per_day: number;
    electric: boolean;
};

export type NewCar = Omit<Car, "id">;

export type CarWithImage = Car & {
    image_url: string | null;
};

export type Table = "Cars"