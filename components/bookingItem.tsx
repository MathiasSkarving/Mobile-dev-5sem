import { Image, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { Booking } from "../types/booking";

interface BookingItemProps {
    booking: Booking;
}

export function BookingItem({ booking }: BookingItemProps) {
    const dateRange = `${booking.startDate.toLocaleDateString()} - ${booking.endDate.toLocaleDateString()}`;

    return (
        <Card style={{ marginVertical: 8, marginHorizontal: 16 }}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={{ uri: booking.imageUrl }}
                    style={{ width: "33%", aspectRatio: 1, borderRadius: 8, margin: 8 }}
                />
                <View style={{ flex: 1, padding: 8 }}>
                    <Text variant="titleMedium">{booking.name}</Text>
                    <Text variant="bodyMedium">{dateRange}</Text>
                    <Text variant="bodyMedium">${booking.pricePerDay.toFixed(2)}/day</Text>
                    <Text variant="bodyMedium">${booking.totalPrice.toFixed(2)} total</Text>
                    <Text variant="labelSmall">Completed</Text>
                </View>
            </View>
        </Card>
    );
}
