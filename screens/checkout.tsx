import { Button, Card, Divider, List, Text, } from 'react-native-paper'
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { CarsTabScreenProps } from '../navigation/types'
import { useDatabase } from '../db/dbprovider'
import { addBookingIfAvailable, getBookings } from '../db/dbbookings'
import { NewBooking } from '../db/types'
import { formatDate, toDbDate } from '../utils/datehelper'

import { useAuth } from '../auth/authContent'

type CheckoutProps = CarsTabScreenProps<'Checkout'>

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
    // Card.Title has a fixed min height, so a two-line subtitle needs extra room
    gateTitle: {
        paddingTop: 16,
        paddingBottom: 8,
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
    const { isLoggedIn, isVerified } = useAuth();
    const canBook = isLoggedIn && isVerified;

    // Set when the user is sent to log in / verify, so we can bring them back afterwards
    const [returnAfterAuth, setReturnAfterAuth] = useState(false);

    function goToProfile() {
        setReturnAfterAuth(true);
        navigation.navigate('ProfileTab', { screen: isLoggedIn ? 'Verification' : 'Login' });
    }

    useEffect(() => {
        if (!returnAfterAuth || !canBook) return;
        setReturnAfterAuth(false);
        // Checkout is still on top of the Search stack, so switching tab is enough
        navigation.navigate('SearchTab');
    }, [returnAfterAuth, canBook, navigation]);

    // Picking another tab than Profile means the user gave up on the booking
    useEffect(() => {
        if (!returnAfterAuth) return;
        return navigation.getParent()?.addListener('state', (e) => {
            const tabs = e.data.state;
            if (tabs.routes[tabs.index].name !== 'ProfileTab') setReturnAfterAuth(false);
        });
    }, [returnAfterAuth, navigation]);

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

                {!canBook && (
                    <Card mode="outlined">
                        <Card.Title
                            title={isLoggedIn ? 'Verify your account' : 'Log in to book'}
                            subtitle={isLoggedIn
                                ? 'You need a verified driving license to book a car'
                                : 'You need to be logged in and verified to book a car'}
                            subtitleNumberOfLines={2}
                            style={styles.gateTitle}
                            titleStyle={{ fontSize: 18, fontWeight: '600' }}
                            left={props => <List.Icon {...props} icon={isLoggedIn ? 'check-decagram' : 'account-alert'} />}
                        />
                        <Card.Actions>
                            <Button onPress={goToProfile}>
                                {isLoggedIn ? 'Verify account' : 'Log in'}
                            </Button>
                        </Card.Actions>
                    </Card>
                )}

                <Button
                    mode="contained"
                    onPress={() => book()}
                    disabled={!canBook}
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
        if (!canBook) return;
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
            navigation.popToTop() // reset the Search stack before leaving it
            navigation.navigate('BookingsTab', { screen: 'Bookings' })
        } catch (e) {
            console.error('booking failed', e)
            Alert.alert('Booking failed', String(e))
        }
    }
}