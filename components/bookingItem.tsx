import { Image, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { Booking } from "../db/types";

interface BookingItemProps {
    booking: Booking;
}

export function BookingItem({ booking }: BookingItemProps) {
    const dateRange = `${booking.start_date} - ${booking.end_date}`;

    return (
        <Card style={{ marginVertical: 8, marginHorizontal: 16 }}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={{ uri: booking.image }}
                    style={{ width: "33%", aspectRatio: 1, borderRadius: 8, margin: 8 }}
                />
                <View style={{ flex: 1, padding: 8 }}>
                    <Text variant="titleMedium">{booking.name}</Text>
                    <Text variant="bodyMedium">{dateRange}</Text>
                    <Text variant="bodyMedium">${booking.price_per_day.toFixed(2)}/day</Text>
                    <Text variant="bodyMedium">${booking.total_price.toFixed(2)} total</Text>
                    <Text variant="labelSmall">Completed</Text>
                </View>
            </View>
        </Card>
    );
}