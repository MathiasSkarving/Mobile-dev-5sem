import { Button, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerModal, enGB, registerTranslation } from 'react-native-paper-dates';
import { useCallback, useState } from 'react';
import Cars from "./cars";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CarsStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

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

registerTranslation("en", enGB); // moved out of component body, runs once

export default function Search() {
    const navigation = useNavigation<NativeStackNavigationProp<CarsStackParamList>>();

    const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
    const [datePickerModalVisible, setDatePickerModalVisible] = useState<boolean>(false);

    const onDismiss = useCallback(() => {
        setDatePickerModalVisible(false);
    }, []);

    const onConfirm = useCallback((range: DateRange) => {
        setDatePickerModalVisible(false);
        setSelectedDateRange(range);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TextInput placeholder="Search Cars" />

            <Button onPress={() => setDatePickerModalVisible(true)} uppercase={false} mode="outlined">
                {selectedDateRange ? formatDateRange(selectedDateRange) : 'Select date range'}
            </Button>

            <DatePickerModal
                locale="en"
                mode="range"
                startWeekOnMonday={true}
                visible={datePickerModalVisible}
                onDismiss={onDismiss}
                startDate={selectedDateRange?.startDate}
                endDate={selectedDateRange?.endDate}
                onConfirm={onConfirm}
                validRange={{ startDate: new Date() }}
            />

            <Cars />
        </SafeAreaView>
    );
}