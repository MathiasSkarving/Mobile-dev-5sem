export type Bookingstatus = 'completed'
//Able to add more status' later on (ongoing, cancelled, etc.)

export interface Booking {
    id: string;
    name: string;
    imageUrl: string;
    startDate: Date;
    endDate: Date;
    pricePerDay: number; //Maybe useless
    totalPrice: number;
    status: Bookingstatus;
}


