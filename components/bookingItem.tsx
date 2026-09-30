import { Image, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { Booking } from "../db/types";

interface BookingItemProps {
    booking: Booking;
}

export function BookingItem({ booking }: BookingItemProps) {
    const dateRange = `${booking.start_date} - ${booking.end_date}`;

    return (
        <Card mode='outlined' style={{ marginVertical: 8, marginHorizontal: 16, borderColor: "#dddddd"}}>
            <Card.Cover source={{ uri: booking.image }} />

            <Card.Title title={booking.name} subtitle={dateRange}/>

            <Card.Content>
                <Text variant="bodyMedium">{booking.price_per_day.toFixed(2)} kr/day</Text>
                <Text variant="bodyMedium">{booking.total_price.toFixed(2)} kr total</Text>
            </Card.Content>
        </Card>
    );
}