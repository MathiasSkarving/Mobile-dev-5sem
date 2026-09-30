import { BottomNavigation, Button, Card, Divider, List, Text, } from 'react-native-paper'
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CarsStackParamList } from '../navigation/types'
import { useDatabase } from '../db/dbprovider'
import { addBookingIfAvailable, getBookings } from '../db/dbbookings'
import { NewBooking } from '../db/types'
import Bookings from './bookings'
import { useTabs } from '../navigation/tabContext'
import { formatDate, toDbDate } from '../utils/datehelper'

type CheckoutProps = NativeStackScreenProps<CarsStackParamList, 'Checkout'>

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    content: {
        padding: 16,
        gap: 16,
    },
    carRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    carImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 16,
    },
    info: {
        alignItems: 'center'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export default function Checkout({ route, navigation }: CheckoutProps) {
    const { car, imageUrl } = route.params
    const carName = `${car.make} ${car.model}`
    const carPrice = car.price_per_day
    const db = useDatabase();

    // Falls back to today -> tomorrow if no date range was selected
    const startDate = route.params.startDate ? new Date(route.params.startDate) : new Date()
    const endDate = route.params.endDate
        ? new Date(route.params.endDate)
        : new Date(startDate.getTime() + 86_400_000)

    // Should be done on server and not on phone
    const days = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000))
    const total = carPrice * days
    const { goToBookings } = useTabs();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Card mode="outlined">
                    <Card.Content>
                        <View style={styles.carRow}>
                            {imageUrl && (
                                <Image
                                    style={styles.carImage}
                                    source={{ uri: imageUrl }}
                                />
                            )}
                            <View style={styles.info}>
                                <Text variant="titleLarge">{carName}</Text>
                            </View>
                        </View>
                        <Divider style={{ marginVertical: 12 }} />
                        <List.Item
                            title="Pick-up"
                            left={props => <List.Icon {...props} icon="calendar-today" />}
                            right={props => (
                                <Text variant="bodyMedium" style={props.style}>
                                    {formatDate(startDate)}
                                </Text>
                            )}
                        />

                        <List.Item
                            title="Return"
                            left={props => <List.Icon {...props} icon="rotate-left" />}
                            right={props => (
                                <Text variant="bodyMedium" style={props.style}>
                                    {formatDate(endDate)}
                                </Text>
                            )}
                        />
                    </Card.Content>
                </Card>

                <Card mode="outlined">
                    <Card.Title
                        title="Price summary"
                        titleStyle={{ fontSize: 18, fontWeight: '600' }}
                    />
                    <Divider />
                    <Card.Content>
                        <List.Item
                            title="Price per day"
                            right={() => <Text variant="bodyMedium">{carPrice} DKK</Text>}
                        />
                        <List.Item
                            title="Days"
                            right={() => <Text variant="bodyMedium">{days}</Text>}
                        />
                        <Divider style={{ marginVertical: 12 }} />
                        <View style={styles.totalRow}>
                            <Text variant="titleMedium">Total</Text>
                            <Text variant="titleLarge">{total} DKK</Text>
                        </View>
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={() => book()}
                >
                    Book {carName}
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                >
                    Cancel
                </Button>
            </ScrollView>
        </View>
    )

    async function book() {
        let newBooking: NewBooking = {
            name: carName,
            car_id: car.id,
            start_date: toDbDate(startDate),
            end_date: toDbDate(endDate),
            price_per_day: carPrice,
            total_price: total,
            image: imageUrl,
        }

        console.log('booking attempt', newBooking)
        try {
            const result = await addBookingIfAvailable(db, newBooking)
            console.log('booking result', result)
            console.log('rows after insert', await getBookings(db))
            if (result === false) {
                Alert.alert('Not available', 'This car is already booked for those dates.')
                return
            }
            navigation.popToTop()
            goToBookings()
        } catch (e) {
            console.error('booking failed', e)
            Alert.alert('Booking failed', String(e))
        }
    }
}