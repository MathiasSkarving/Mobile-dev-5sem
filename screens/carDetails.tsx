import { Button, Divider, List, Text } from 'react-native-paper'
import { Dimensions, Image, ScrollView, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { DatePickerModal } from 'react-native-paper-dates'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CarsStackParamList } from '../navigation/types'
import { toDbDate } from '../utils/datehelper'

type Props = NativeStackScreenProps<CarsStackParamList, 'CarDetails'>

interface DateRange {
    startDate: Date | undefined;
    endDate: Date | undefined;
}

function formatDate(date?: Date): string {
    if (!date) return 'Not selected'

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export default function CarDetails({ route, navigation }: Props) {
    const { car, imageUrl } = route.params
    const carName = `${car.make} ${car.model}`

    // Starts with the dates chosen on the search page, but can be changed here
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: route.params.startDate ? new Date(route.params.startDate) : undefined,
        endDate: route.params.endDate ? new Date(route.params.endDate) : undefined,
    })
    const [datePickerModalVisible, setDatePickerModalVisible] = useState<boolean>(false)

    const onDismiss = useCallback(() => {
        setDatePickerModalVisible(false)
    }, [])

    const onConfirm = useCallback((range: DateRange) => {
        setDatePickerModalVisible(false)
        setDateRange(range)
    }, [])

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        navigation.setOptions({ title: carName })
    }, [navigation, carName])

    return (
        <ScrollView>
            {imageUrl && (
                <Image source={{ uri: imageUrl }} style={{ width: windowWidth, height: windowHeight * 0.3 }} />
            )}

            <View style={{ padding: windowWidth * 0.05 }}>
                <Text variant="headlineMedium">{carName}</Text>
                <Text variant="titleLarge" style={{ marginTop: windowHeight * 0.005 }}>
                    {car.price_per_day} kr./day
                </Text>

                <Divider style={{ marginVertical: windowHeight * 0.02 }} />

                <Text variant="titleMedium">Car</Text>
                <List.Item
                    title="Make"
                    left={props => <List.Icon {...props} icon="car" />}
                    right={props => <Text variant="bodyMedium" style={props.style}>{car.make}</Text>}
                />
                <List.Item
                    title="Model"
                    left={props => <List.Icon {...props} icon="car-info" />}
                    right={props => <Text variant="bodyMedium" style={props.style}>{car.model}</Text>}
                />
                <List.Item
                    title="Fuel"
                    left={props => <List.Icon {...props} icon={car.electric ? 'lightning-bolt' : 'gas-station'} />}
                    right={props => <Text variant="bodyMedium" style={props.style}>{car.electric ? 'Electric' : 'Petrol'}</Text>}
                />

                <Divider style={{ marginVertical: windowHeight * 0.02 }} />

                <Text variant="titleMedium">Dates</Text>
                <List.Item
                    title="Pick-up"
                    onPress={() => setDatePickerModalVisible(true)}
                    left={props => <List.Icon {...props} icon="calendar-today" />}
                    right={props => <Text variant="bodyMedium" style={props.style}>{formatDate(dateRange.startDate)}</Text>}
                />
                <List.Item
                    title="Return"
                    onPress={() => setDatePickerModalVisible(true)}
                    left={props => <List.Icon {...props} icon="rotate-left" />}
                    right={props => <Text variant="bodyMedium" style={props.style}>{formatDate(dateRange.endDate)}</Text>}
                />

                <View style={{gap: 16}}>
                    <Button
                        mode="outlined"
                        icon="calendar"
                        onPress={() => setDatePickerModalVisible(true)}
                    >
                        Change dates
                    </Button>

                    <Button
                        mode="contained"
                        icon="car-key"
                        onPress={() => navigation.navigate('Checkout', {
                            car,
                            imageUrl,
                            startDate: toDbDate(dateRange.startDate),
                            endDate: toDbDate(dateRange.endDate),
                        })}
                    >
                        Book
                    </Button>
                </View>

                <DatePickerModal
                    locale="en"
                    mode="range"
                    startWeekOnMonday={true}
                    visible={datePickerModalVisible}
                    onDismiss={onDismiss}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onConfirm={onConfirm}
                    validRange={{ startDate: new Date() }}
                    animationType={"slide"}

                    // when end date selected, autosave to save on clicks :)
                    onChange={({ startDate, endDate }) => {
                        if (endDate) {
                            onConfirm({ startDate, endDate });
                        }
                    }}

                    // disable the manual save button completely
                    saveLabel={" "}
                    saveLabelDisabled={true}
                />
            </View>
        </ScrollView>
    )
}