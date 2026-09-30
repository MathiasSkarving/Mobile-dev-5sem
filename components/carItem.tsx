// components/CarItem.tsx
import { Pressable, Dimensions } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import { CarWithThumbnail } from '../db/types'

interface CarItemProps {
    car: CarWithThumbnail
    onPressDetails: () => void
    onPressBook: () => void
}

export default function CarItem({ car, onPressDetails, onPressBook }: CarItemProps) {
    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    return (
        <Card
            mode="elevated"
            style={{ width: windowWidth * 0.9, alignSelf: 'center', marginBottom: windowHeight * 0.02 }}
        >
            {car.thumbnail_url && (
                <Pressable onPress={onPressDetails}>
                    <Card.Cover source={{ uri: car.thumbnail_url }} />
                </Pressable>
            )}
            <Card.Title
                title={`${car.make} ${car.model}`}
                titleVariant="titleMedium"
                subtitle={car.electric ? 'Electric' : undefined}
                right={() => (
                    <Text variant="titleMedium" style={{ marginRight: windowWidth * 0.04 }}>
                        {car.price_per_day} kr./day
                    </Text>
                )}
            />
            <Card.Actions>
                <Button onPress={onPressBook} mode="contained" icon="car-key">
                    Book
                </Button>
            </Card.Actions>
        </Card>
    )
}