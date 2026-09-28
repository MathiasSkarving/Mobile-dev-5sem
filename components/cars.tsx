import { Button, Card, Text } from 'react-native-paper'
import { Dimensions, FlatList } from 'react-native'
import { Car, CARS } from '../data/cars';

type CarsProps = {
    cars?: Car[];
};

export default function Cars({ cars = CARS }: CarsProps) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <FlatList
            style={{flex: 1}}
            data={cars}
            keyExtractor={(car) => car.id}
            ListHeaderComponent={
                <Text variant="titleMedium"
                style={{width: windowWidth * 0.9, alignSelf: 'center', marginTop: windowHeight * 0.02, marginBottom: windowHeight * 0.01}}>
                    Available cars
                </Text>
            }
            ListEmptyComponent={
                <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.05}}>
                    No cars found
                </Text>
            }
            renderItem={({ item }) => (
                <Card mode="elevated" onPress={() => console.log('Selected car', item.id)}
                style={{width: windowWidth * 0.9, alignSelf: 'center', marginBottom: windowHeight * 0.02}}>
                    <Card.Cover source={{ uri: item.image }} />
                    <Card.Title
                        title={item.name}
                        titleVariant="titleMedium"
                        right={() => (
                            <Text variant="titleMedium" style={{marginRight: windowWidth * 0.04}}>
                                {item.pricePerDay} kr./day
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
