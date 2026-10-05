// components/CarItem.tsx
import {Pressable, StyleSheet, View} from 'react-native'
import {Button, Card, Icon, Text, useTheme} from 'react-native-paper'
import {CarDisplayMode, CarWithThumbnail} from '../db/types'

// Warm accent, so promoted cars stand out from the purple theme
const PROMO = {
    background: '#FFE08A',
    border: '#F2B600',
    text: '#4A3600',
}

const styles = StyleSheet.create({
    promoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: PROMO.background,
    },
    promoText: {
        color: PROMO.text,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
})

interface CarItemProps {
    car: CarWithThumbnail,
    onPressDetails: () => void,
    onPressBook: () => void,
    mode: CarDisplayMode
}

export default function CarItem({car, onPressDetails, onPressBook, mode}: CarItemProps) {
    const theme = useTheme();
    const showPromo = !!car.promotional_text && mode != "booked";
    const borderWidth = showPromo ? 2 : 1;
    // MD3 cards are rounded 3x the theme roundness - minus the border, so the banner fits inside it
    const innerRadius = theme.roundness * 3 - borderWidth;

    return (
        <View style={{
            justifyContent: 'center',
            margin: 20,
        }}>
            <Card
                mode="outlined"
                style={{
                    borderColor: showPromo ? PROMO.border : "#dddddd",
                    borderWidth,
                }}
            >
                {/* Part of the card, so it reads as a label on this car and not a separate ad */}
                {showPromo && (
                    <View style={[styles.promoBanner, {borderTopLeftRadius: innerRadius, borderTopRightRadius: innerRadius}]}>
                        <Icon source="tag" size={18} color={PROMO.text}/>
                        <Text variant="labelLarge" style={styles.promoText}>
                            {car.promotional_text.toUpperCase()}
                        </Text>
                    </View>
                )}

                {car.thumbnail_url && (
                    <Pressable onPress={onPressDetails} disabled={mode === "no_date_selected"}>
                        {/* Square top corners under the banner, so the two meet without gaps */}
                        <Card.Cover
                            source={{uri: car.thumbnail_url}}
                            style={showPromo ? {borderTopLeftRadius: 0, borderTopRightRadius: 0} : undefined}
                        />
                    </Pressable>
                )}

                <Card.Title
                    title={`${car.make} ${car.model}`}
                    titleVariant="titleMedium"
                    subtitle={car.electric ? 'Electric' : undefined}
                />

                <Card.Actions style={{justifyContent: "space-between", alignItems: 'center'}}>
                    <Text variant="titleMedium">
                        {car.price_per_day} kr./day
                    </Text>

                    <Button onPress={onPressBook} mode="contained" icon="car-key"
                            disabled={mode === "no_date_selected"}>
                        Book
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    )
}