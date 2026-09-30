// components/CarItem.tsx
import { Pressable, Dimensions } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import { CarDisplayMode, CarWithThumbnail } from '../db/types'

interface CarItemProps {
    car: CarWithThumbnail,
    onPressDetails: () => void,
    onPressBook: () => void,
    mode: CarDisplayMode
}

export default function CarItem({ car, onPressDetails, onPressBook, mode }: CarItemProps) {
    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    return (
        <Card
            mode="outlined"
            style={{ width: windowWidth * 0.9, alignSelf: 'center', marginBottom: windowHeight * 0.02, borderColor: "#dddddd"}}
        >
            {car.thumbnail_url && (
                <Pressable onPress={onPressDetails} disabled={mode==="no_date_selected"}>
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
                <Button onPress={onPressBook} mode="contained" icon="car-key" disabled={mode === "no_date_selected"}>
                    Book
                </Button>
            </Card.Actions>

        </Card>
    )
}