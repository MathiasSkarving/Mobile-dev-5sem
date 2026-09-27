import { Button, Card, Chip, Divider, List, Text, } from 'react-native-paper'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface CheckoutProps {
    carImage: string
    carName: string
    carPrice: number
    startDate: string
    endDate: string
}

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

export default function Checkout() {//{ carImage, carName, carPrice, startDate, endDate }: CheckoutProps) {
    const carImage = '../assets/icon.png'
    const carName = 'Citroën C3'
    const carPrice = 100
    const startDate = "2026-09-28"
    const endDate = "2026-10-05"

    const days = 8
    const total = carPrice * days

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Card mode="outlined">
                    <Card.Content>
                        <View style={styles.carRow}>
                            <Image
                                style={styles.carImage}
                                source={require('../assets/icon.png')}
                            />
                            <View style={styles.info}>
                                <Text variant="titleLarge">{carName}</Text>
                                <Chip
                                    icon="check-circle"
                                    //mode="outlined"
                                    style={{ marginTop: 8 }}
                                >
                                    Available
                                </Chip>
                            </View>
                        </View>
                        <Divider style={{ marginVertical: 12 }} />
                        <List.Item
                            title="Pick-up"
                            left={props => <List.Icon {...props} icon="calendar-today" />}
                            right={props => (
                                <Text variant="bodyMedium" style={props.style}>
                                    {startDate}
                                </Text>
                            )}
                        />

                        <List.Item
                            title="Return"
                            left={props => <List.Icon {...props} icon="rotate-left" />}
                            right={props => (
                                <Text variant="bodyMedium" style={props.style}>
                                    {endDate}
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
                    icon="check"
                    onPress={() => { }}
                >
                    Book {carName}
                </Button>

                <Button
                    mode="outlined"
                    icon="close"
                    onPress={() => { }}
                >
                    Cancel
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}