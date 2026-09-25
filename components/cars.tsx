import { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';

import { getCars, addCar } from '../db/dbcars';
import { Car } from '../db/types';
import { useDatabase } from '../db/dbprovider';

const STATIC_CARS = [
    { make: 'Tesla', model: 'Model 3', price_per_day: 45, electric: true },
    { make: 'Toyota', model: 'Corolla', price_per_day: 25, electric: false },
    { make: 'Volkswagen', model: 'ID.4', price_per_day: 40, electric: true },
];

export default function Cars() {
    const db = useDatabase();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCars = useCallback(async () => {
        const result = await getCars(db);
        console.log('Cars fetched:', result);
        setCars(result);
    }, [db]);

    useEffect(() => {
        (async () => {
            try {
                const existing = await getCars(db);
                console.log('Existing cars:', existing);
                if (existing.length === 0) {
                    for (const car of STATIC_CARS) {
                        await addCar(db, car);
                    }
                }
                await loadCars();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [db, loadCars]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading cars...</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>
                These are the cars:
            </Text>
            <FlatList
                data={cars}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Card mode='outlined'>
                        <Card.Content>
                            <Text variant="titleMedium">
                                {item.make} {item.model}
                            </Text>
                            <Text>
                                {item.electric ? 'Electric' : 'Petrol'} · ${item.price_per_day}/day
                            </Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { marginBottom: 12 },
    list: { flex: 1 },              // ← the actual fix
    listContent: { gap: 8 },        // renamed from your old `list`
});