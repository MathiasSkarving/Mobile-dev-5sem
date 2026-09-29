import {Card, Divider, Icon, Searchbar, Text} from 'react-native-paper'
import {SafeAreaView} from 'react-native-safe-area-context';
import {DatePickerModal, enGB, registerTranslation} from 'react-native-paper-dates';
import {useCallback, useEffect, useState} from 'react';
import Cars from "./cars";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CarsStackParamList} from '../navigation/types';
import {useNavigation} from '@react-navigation/native';
import {View} from "react-native";

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
                    <Card.Content style={{flexDirection: "row"}}>
                        <Icon size={20} source={"calendar"}/>
                        <Text>{selectedDateRange ? formatDateRange(selectedDateRange) : 'Select date range'}</Text>
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

            <Cars/>
        </SafeAreaView>
    );
}

const WORDS = [
    'a make...',
    'a model...',
    'a trusty Toyota...',
    'a sensible Golf...',
    'a Porsche you can’t afford...',
    'a BMW (turn signals optional)...',
    'literally any Volvo...',
    'a car with 4 wheels...',
    'a Tesla to look techy...',
    'a Batmobile (we wish)...',
];

function getRandomWordIndex(currentIndex: number): number {
    if (WORDS.length <= 1) return 0;
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * WORDS.length);
    }
    return nextIndex;
}

const TYPEWRITER_CONFIG = {
    TYPING_SPEED_MS: 60,
    DELETING_SPEED_MS: 30,
    PAUSE_AT_END_MS: 2000,
    PAUSE_BEFORE_NEXT_WORD_MS: 200,
    TYPING_STEP_SIZE: 1,
    DELETING_STEP_SIZE: 2,
};

function TypewriterSearchbar({value, onChangeText}: { value: string; onChangeText: (t: string) => void }) {
    const [displayedText, setDisplayedText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (value.length > 0) return;

        const currentWord = WORDS[wordIndex];

        let delay = isDeleting ? TYPEWRITER_CONFIG.DELETING_SPEED_MS : TYPEWRITER_CONFIG.TYPING_SPEED_MS;
        const step = isDeleting ? TYPEWRITER_CONFIG.DELETING_STEP_SIZE : TYPEWRITER_CONFIG.TYPING_STEP_SIZE;

        if (!isDeleting && displayedText === currentWord) {
            delay = TYPEWRITER_CONFIG.PAUSE_AT_END_MS;
        } else if (isDeleting && displayedText === '') {
            const timer = setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((prev) => getRandomWordIndex(prev));
            }, TYPEWRITER_CONFIG.PAUSE_BEFORE_NEXT_WORD_MS);

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            if (!isDeleting) {
                if (displayedText.length < currentWord.length) {
                    setDisplayedText(currentWord.slice(0, displayedText.length + step));
                } else {
                    setIsDeleting(true);
                }
            } else {
                setDisplayedText(currentWord.slice(0, Math.max(0, displayedText.length - step)));
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, wordIndex, value]);

    return (
        <Searchbar
            value={value}
            onChangeText={onChangeText}
            placeholder={`Search for ${displayedText}`}
        />
    );
}