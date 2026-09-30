import {Button, Card, Divider, Icon, Searchbar, Text} from 'react-native-paper'
import {SafeAreaView} from 'react-native-safe-area-context';
import {DatePickerModal, enGB, registerTranslation} from 'react-native-paper-dates';
import {useCallback, useEffect, useState} from 'react';
import Cars from "./cars";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CarsStackParamList} from '../navigation/types';
import {useNavigation} from '@react-navigation/native';
import {View} from "react-native";
import TypewriterSearchbar from '../components/typeWriterSearchBar';

interface DateRange {
    startDate: Date | undefined;
    endDate: Date | undefined;
}

function formatDateRange(range: DateRange): string {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return formatter.format(range.startDate) + " - " + formatter.format(range.endDate);
}

registerTranslation("en", enGB);

export default function Search() {
    const navigation = useNavigation<NativeStackNavigationProp<CarsStackParamList>>();

    const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
    const [datePickerModalVisible, setDatePickerModalVisible] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState('');

    const onDismiss = useCallback(() => {
        setDatePickerModalVisible(false);
    }, []);

    const onConfirm = useCallback((range: DateRange) => {
        setDatePickerModalVisible(false);
        setSelectedDateRange(range);
    }, []);

    function clearDateRange() {
        setSelectedDateRange(undefined);
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{margin: 20, gap: 12}}>

                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12}}>
                    <Icon source={"car-side"} size={50} color={"#6750a4"}/>
                    <Text variant={"titleLarge"} style={{color: "#6750a4", fontWeight: "bold"}}>
                        OG Car Booking
                    </Text>
                </View>

                <TypewriterSearchbar value={searchQuery} onChangeText={setSearchQuery}/>

                <Card onPress={() => setDatePickerModalVisible(true)} mode="outlined">
                    <Card.Content>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{flexDirection: "row", gap: 12}}>
                                <Icon size={20} source={"calendar"}/>
                                <Text>{selectedDateRange ? formatDateRange(selectedDateRange) : 'Select date range'}</Text>
                            </View>
                            <Button onPress={clearDateRange} disabled={selectedDateRange === undefined}>
                                {selectedDateRange === undefined ? "" : "Clear"}
                            </Button>
                        </View>
                    </Card.Content>
                </Card>

                <DatePickerModal
                    locale="en"
                    mode="range"
                    startWeekOnMonday={true}
                    visible={datePickerModalVisible}
                    onDismiss={onDismiss}
                    startDate={selectedDateRange?.startDate}
                    endDate={selectedDateRange?.endDate}
                    onConfirm={onConfirm}
                    validRange={{startDate: new Date()}}
                    animationType={"slide"}

                    // when end date selected, autosave to save on clicks :)
                    onChange={({startDate, endDate}) => {
                        if (endDate) {
                            onConfirm({startDate, endDate});
                        }
                    }}

                    // disable the manual save button completely
                    saveLabel={" "}
                    saveLabelDisabled={true}
                />

            </View>

            <Divider/>

            <Cars searchQuery = {searchQuery} startDate={selectedDateRange?.startDate} endDate={selectedDateRange?.endDate}/>
        </SafeAreaView>
    );
}