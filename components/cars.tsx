import { ActivityIndicator, Button, Card, Text } from 'react-native-paper'
import { Dimensions, FlatList } from 'react-native'
import { useEffect, useState } from 'react';
import { useDatabase } from '../db/dbprovider';
import { getCars, getCarsWithThumbnails } from '../db/dbcars';
import { getFirstImage } from '../db/dbimages';
import { Car, CarWithThumbnail } from '../db/types';

export default function Cars() {
    const db = useDatabase();
    const [cars, setCars] = useState<CarWithThumbnail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        getCarsWithThumbnails(db)
            .then(setCars)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [db]);

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
                    Available cars
                </Text>
            }
            ListEmptyComponent={
                <Text style={{ alignSelf: 'center', marginTop: windowHeight * 0.05 }}>
                    {error ?? 'No cars found'}
                </Text>
            }
            renderItem={({ item }) => (
                <Card mode="elevated"
                    style={{ width: windowWidth * 0.9, alignSelf: 'center', marginBottom: windowHeight * 0.02 }}>

                    {item.thumbnail_url && <Card.Cover source={{ uri: item.thumbnail_url }} />}                 
                    <Card.Title
                        title={`${item.make} ${item.model}`}
                        titleVariant="titleMedium"
                        subtitle={item.electric ? 'Electric' : undefined}
                        right={() => (
                            <Text variant="titleMedium" style={{ marginRight: windowWidth * 0.04 }}>
                                {item.price_per_day} kr./day
                            </Text>
                        )}
                    />

                    <Card.Actions>
                        <Button mode="contained" icon="car-key" onPress={() => { }}>
                            Book
                        </Button>
                    </Card.Actions>
                </Card>
            )}
        />
    );
}