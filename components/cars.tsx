import { ActivityIndicator, Button, Card, Text } from 'react-native-paper'
import { Dimensions, FlatList } from 'react-native'
import { useEffect, useState } from 'react';
import { useDatabase } from '../db/dbprovider';
import { getCars } from '../db/dbcars';
import { getFirstImage } from '../db/dbimages';
import { Car } from '../db/types';

export default function Cars() {
    const db = useDatabase();
    const [cars, setCars] = useState<Car[]>([]);
    const [firstImages, setFirstImages] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        getCars(db)
            .then(async (fetchedCars) => {
                setCars(fetchedCars);

                const imageEntries = await Promise.all(
                    fetchedCars.map(async (car) => {
                        const image = await getFirstImage(db, car.id);
                        return [car.id, image?.url] as const;
                    })
                );

                const imageMap = Object.fromEntries(
                    imageEntries.filter(([, url]) => url !== undefined)
                ) as Record<number, string>;

                setFirstImages(imageMap);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [db]);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: windowHeight * 0.05 }} />;
    }

    return (
        <FlatList
            style={{flex: 1}}
            data={cars}
            keyExtractor={(car) => car.id.toString()}
            ListHeaderComponent={
                <Text variant="titleMedium"
                style={{width: windowWidth * 0.9, alignSelf: 'center', marginTop: windowHeight * 0.02, marginBottom: windowHeight * 0.01}}>
                    Available cars
                </Text>
            }
            ListEmptyComponent={
                <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.05}}>
                    {error ?? 'No cars found'}
                </Text>
            }
            renderItem={({ item }) => (
                <Card mode="elevated"
                style={{width: windowWidth * 0.9, alignSelf: 'center', marginBottom: windowHeight * 0.02}}>
                    {firstImages[item.id] && <Card.Cover source={{ uri: firstImages[item.id] }} />}
                    <Card.Title
                        title={`${item.make} ${item.model}`}
                        titleVariant="titleMedium"
                        subtitle={item.electric ? 'Electric' : undefined}
                        right={() => (
                            <Text variant="titleMedium" style={{marginRight: windowWidth * 0.04}}>
                                {item.price_per_day} kr./day
                            </Text>
                        )}
                    />
                    <Card.Actions>
                        <Button mode="contained" icon="car-key" onPress={() => {}}>
                            Book
                        </Button>
                    </Card.Actions>
                </Card>
            )}
        />
    );
}