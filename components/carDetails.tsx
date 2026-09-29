import { Button, Card, Chip, Text } from 'react-native-paper'
import { Dimensions, ScrollView } from 'react-native'
import { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CarsStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<CarsStackParamList, 'CarDetails'>

export default function CarDetails({ route, navigation }: Props) {
    const { car, imageUrl, startDate, endDate } = route.params
    const carName = `${car.make} ${car.model}`

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        navigation.setOptions({ title: carName })
    }, [navigation, carName])

    return (
        <ScrollView>
            <Card mode="elevated"
                style={{ width: windowWidth * 0.9, alignSelf: 'center', marginTop: windowHeight * 0.02 }}>

                {imageUrl && <Card.Cover source={{ uri: imageUrl }} />}
                <Card.Title
                    title={carName}
                    titleVariant="titleMedium"
                    right={() => (
                        <Text variant="titleMedium" style={{ marginRight: windowWidth * 0.04 }}>
                            {car.price_per_day} kr./day
                        </Text>
                    )}
                />

                {!!car.electric && (
                    <Card.Content>
                        <Chip icon="lightning-bolt" style={{ alignSelf: 'flex-start' }}>
                            Electric
                        </Chip>
                    </Card.Content>
                )}

                <Card.Actions>
                    <Button onPress={() => navigation.navigate('Checkout', {
                        car,
                        imageUrl,
                        startDate,
                        endDate,
                    })} mode="contained" icon="car-key">
                        Book
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    )
}