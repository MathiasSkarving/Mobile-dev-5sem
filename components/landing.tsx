import { Button, Text, TextInput } from 'react-native-paper'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerModal } from 'react-native-paper-dates';
import { useState, useCallback } from 'react';

export default function Landingpage() {
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });

    const [open, setOpen] = useState(false);

    const onDismiss = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });
        },
        [setOpen, setRange]
    );

    return (
        <SafeAreaView>
            <TextInput placeholder='Search Cars'></TextInput>
            <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                Pick range
            </Button>
            <DatePickerModal
                locale="en"
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={range.startDate}
                endDate={range.endDate}
                onConfirm={onConfirm}
            />
        </SafeAreaView>
    );
}