import { Text } from 'react-native-paper'
import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDatabase } from '../db/dbprovider';
import { Booking } from '../db/types';
import { BookingItem } from './bookingItem';
import { getBookings } from '../db/dbbookings';

export default function Bookings() {
    const db = useDatabase();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Reload every time the tab is opened, so new bookings show up
    useFocusEffect(useCallback(() => {
        let cancelled = false;

        setLoading(true);
        setError(null);

        getBookings(db)
            .then((result) => {
                console.log(JSON.stringify(result, null, 2));
                if (!cancelled) setBookings(result);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message ?? 'Failed to load cars');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [db]));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text variant="headlineSmall" style={{ margin: 16 }}>These are your bookings:</Text>
            <FlatList
                data={bookings}
                keyExtractor={(booking) => booking.id.toString()}
                renderItem={({ item }) => <BookingItem booking={item} />}
                ListEmptyComponent={
                    <Text style={{ margin: 16 }}>You don't have any bookings yet.</Text>
                }
            />
        </SafeAreaView>
    );
}