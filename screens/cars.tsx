import { ActivityIndicator, Button, Card, Text } from 'react-native-paper'
import { Dimensions, FlatList, Pressable } from 'react-native'
import { useEffect, useState } from 'react';
import { useDatabase } from '../db/dbprovider';
import { getAvailableCarsFromSearchQuery, getAvailableCarsWithThumbnailFromSearchQuery, getCarsWithThumbnails } from '../db/dbcars';
import { CarDisplayMode, CarWithThumbnail } from '../db/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { CarsStackParamList } from '../navigation/types';
import CarItem from '../components/carItem';
import { useTabs } from '../navigation/tabContext';
import { toDbDate } from '../utils/datehelper';

interface CarsProps {
    searchQuery?: string
    startDate?: Date
    endDate?: Date
}

export default function Cars({ searchQuery, startDate, endDate }: CarsProps) {
    const navigation = useNavigation<NativeStackNavigationProp<CarsStackParamList>>();
    const db = useDatabase();
    const [cars, setCars] = useState<CarWithThumbnail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const displayMode: CarDisplayMode = startDate === undefined ? 'no_date_selected' : 'available'

    const { bookingsVersion } = useTabs()

    console.log('availability args', { searchQuery, startDate, endDate })

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError(null);
        if (searchQuery != undefined) {
            getAvailableCarsWithThumbnailFromSearchQuery(db, searchQuery, startDate, endDate)
                .then((result) => {
                    if (!cancelled) setCars(result);
                })
                .catch((e) => {
                    if (!cancelled) setError(e.message ?? 'Failed to load cars');
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
        }
    }, [db, searchQuery, startDate, endDate, bookingsVersion]);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: windowHeight * 0.05 }} />;
    }

    return (
        <FlatList
            style={{ flex: 1 }}
            data={cars}
            keyExtractor={(car) => car.id.toString()}
            ListHeaderComponent={
                <Text variant="titleMedium"
                    style={{ width: windowWidth * 0.9, alignSelf: 'center', marginTop: windowHeight * 0.02, marginBottom: windowHeight * 0.01 }}>
                    {cars.length} {cars.length === 1 ? 'car' : 'cars'} available
                </Text>
            }
            ListEmptyComponent={
                <Text style={{ alignSelf: 'center', marginTop: windowHeight * 0.05 }}>
                    {error ?? 'No cars found'}
                </Text>
            }
            renderItem={({ item }) => (
                <CarItem
                    car={item}
                    onPressDetails={() => navigation.navigate('CarDetails', {
                        car: item,
                        imageUrl: item.thumbnail_url ?? undefined,
                        startDate: toDbDate(startDate),
                        endDate: toDbDate(endDate)
                    })}
                    onPressBook={() => navigation.navigate('Checkout', {
                        car: item,
                        imageUrl: item.thumbnail_url ?? undefined,
                        startDate: toDbDate(startDate),
                        endDate: toDbDate(endDate)
                    })} mode={displayMode}
                />
            )}
        />
    );
}