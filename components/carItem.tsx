// components/CarItem.tsx
import {Pressable, View} from 'react-native'
import {Button, Card, Text} from 'react-native-paper'
import {CarDisplayMode, CarWithThumbnail} from '../db/types'

interface CarItemProps {
    car: CarWithThumbnail,
    onPressDetails: () => void,
    onPressBook: () => void,
    mode: CarDisplayMode
}

export default function CarItem({car, onPressDetails, onPressBook, mode}: CarItemProps) {

    return (
        <View style={{
            justifyContent: 'center',
            margin: 20,
            gap: 2
        }}>

            {car.promotional_text && (mode != "booked") && (
                <Text
                    style={{
                        backgroundColor: "#ffdf00",
                        textAlign: "center",
                        borderRadius: 10,
                        borderColor: "#dddddd"
                    }}
                    variant="headlineMedium">
                    {car.promotional_text}
                </Text>
            )}

            <Card
                mode="outlined"
                style={{
                    borderColor: "#dddddd"
                }}
            >

                {car.thumbnail_url && (
                    <Pressable onPress={onPressDetails} disabled={mode === "no_date_selected"}>
                        <Card.Cover source={{uri: car.thumbnail_url}}/>
                    </Pressable>
                )}

                <Card.Title
                    title={`${car.make} ${car.model}`}
                    titleVariant="titleMedium"
                    subtitle={car.electric ? 'Electric' : undefined}
                />

                <Card.Actions style={{justifyContent: "space-between", alignItems: 'center'}}>
                    <Text variant="titleMedium">
                        {car.price_per_day} kr./day
                    </Text>

                    <Button onPress={onPressBook} mode="contained" icon="car-key"
                            disabled={mode === "no_date_selected"}>
                        Book
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    )
}