
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

export type CarDisplayMode = 'booked' | 'available' | 'no_date_selected'

// Dates are understood as 'YYYY-MM-DD'
export type Booking = {
    id: number;
    name: string;
    car_id: number;
    start_date: string; 
    end_date: string;
    price_per_day: number;
    total_price: number;   
    image: string | undefined;
};

export type NewBooking = Omit<Booking, "id">;

export type CarWithThumbnail = Car & { thumbnail_url: string | null };

export type NewCar = Omit<Car, "id">;
export type NewCarImage = Omit<CarImage, "id">;

export type CarsTable = "Cars"
export type ImagesTable = "Images"