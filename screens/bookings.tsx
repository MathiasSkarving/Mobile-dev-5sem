import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingItem } from '../components/bookingItem';
import { Booking } from '../types/booking';

const bookings: Booking[] = [
    {
        id: '1',
        name: 'Nissan GT-R 2020',
        imageUrl: 'https://picsum.photos/700',
        startDate: new Date('2026-03-12'),
        endDate: new Date('2026-03-15'),
        pricePerDay: 420,
        totalPrice: 1260,
        status: 'completed',
    },
];

export default function Bookings() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text variant="headlineSmall" style={{ margin: 16 }}>These are your bookings:</Text>
            <FlatList
                data={bookings}
                keyExtractor={(booking) => booking.id}
                renderItem={({ item }) => <BookingItem booking={item} />}
                ListEmptyComponent={
                    <Text style={{ margin: 16 }}>You don't have any bookings yet.</Text>
                }
            />
        </SafeAreaView>
    );
}
