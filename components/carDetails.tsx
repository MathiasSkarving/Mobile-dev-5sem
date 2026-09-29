import { Button, Chip, Text } from 'react-native-paper'
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native'
import { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CarsStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<CarsStackParamList, 'CarDetails'>

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    image: {
        width: windowWidth,
        height: 250,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})

export default function CarDetails({ route, navigation }: Props) {
    const { car, imageUrl, startDate, endDate } = route.params
    const carName = `${car.make} ${car.model}`

    useEffect(() => {
        navigation.setOptions({ title: carName })
    }, [navigation, carName])

    return (
        <ScrollView>
            {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            )}

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text variant="headlineSmall">{carName}</Text>
                    <Text variant="titleLarge">{car.price_per_day} kr./day</Text>
                </View>

                {!!car.electric && (
                    <Chip icon="lightning-bolt" style={{ alignSelf: 'flex-start' }}>
                        Electric
                    </Chip>
                )}

                <Button
                    mode="contained"
                    icon="car-key"
                    onPress={() => navigation.navigate('Checkout', {
                        car,
                        imageUrl,
                        startDate,
                        endDate,
                    })}
                >
                    Book
                </Button>
            </View>
        </ScrollView>
    )
}