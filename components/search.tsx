import {Button, TextInput} from 'react-native-paper'
import {SafeAreaView} from 'react-native-safe-area-context';
import {DatePickerModal, enGB, registerTranslation} from 'react-native-paper-dates';
import {useCallback, useState} from 'react';
import Cars from "./cars";

interface DateRange {
    startDate: Date | undefined;
    endDate: Date | undefined;
}

/** Utility function to format the selected dates. */
function formatDateRange(range: DateRange): string {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return formatter.format(range.startDate) + " - " + formatter.format(range.endDate);
}

export default function Search() {

    // The date range selected by the user through the date picker modal
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
        undefined
    );

    const [datePickerModalVisible, setDatePickerModalVisible] = useState<boolean>(
        false
    );

    const onDismiss = useCallback(() => {
            // Close the modal.
            setDatePickerModalVisible(false);
        }, [setDatePickerModalVisible]
    );

    const onConfirm = useCallback((range: DateRange) => {
            // Close the modal and save the selected date range.
            setDatePickerModalVisible(false);
            setSelectedDateRange(range);
        },
        [setDatePickerModalVisible, setSelectedDateRange]
    );

    // Fixes " WARN [react-native-paper-dates] The locale en is not registered... https://github.com/xgfe/react-native-datepicker/issues/473#issuecomment-1927492425"
    registerTranslation("en", enGB);

    return (
        <SafeAreaView>

            <TextInput placeholder="Search Cars"/>

            <Button onPress={() => setDatePickerModalVisible(true)} uppercase={false} mode="outlined">
                {selectedDateRange ?
                    formatDateRange(selectedDateRange)
                    : 'Select date range'
                }
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
                validRange={{
                    startDate: new Date()
                }}
            />

            <Cars/>

        </SafeAreaView>
    );
}