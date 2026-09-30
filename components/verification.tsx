import { useState } from 'react';
import { Button, Card, Checkbox, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DatePickerInput } from 'react-native-paper-dates';
import { ProfileStackParamList } from '../navigation/types';
import { useAuth } from '../auth/authContent';
import { useTransitionGuard } from '../navigation/useTransitionGuard';
import { da, registerTranslation } from 'react-native-paper-dates';

type VerificationProps = NativeStackScreenProps<ProfileStackParamList, 'Verification'>;

// Concept mode: only the confirm checkbox is required. Flip to true to validate all fields
const VALIDATE_FIELDS = false;
const MIN_AGE = 18;
const MIN_LICENSE_YEARS = 1;

registerTranslation('da', da);

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, gap: 8 },
    header: { flexDirection: 'row', alignItems: 'center' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center' },
    checkboxLabel: { flex: 1 },
});

function yearsSince(date: Date): number {
    const now = new Date();
    let years = now.getFullYear() - date.getFullYear();
    const hadAnniversary =
        now.getMonth() > date.getMonth() ||
        (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());
    if (!hadAnniversary) years--;
    return years;
}

export default function Verification({ navigation }: VerificationProps) {
    const guard = useTransitionGuard();
    const { isVerified, verify } = useAuth();

    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState<Date | undefined>();
    const [licenseNumber, setLicenseNumber] = useState('');
    const [issueDate, setIssueDate] = useState<Date | undefined>();
    const [expiryDate, setExpiryDate] = useState<Date | undefined>();
    const [confirmed, setConfirmed] = useState(false);
    // Only show errors after the first submit attempt, so the form doesn't start out red
    const [submitted, setSubmitted] = useState(false);

    // Should be validated on a server against a real registry - this is only client-side checks
    const fieldErrors = {
        fullName: fullName.trim().length < 2 ? 'Enter your full name as shown on your license' : null,
        birthDate: !birthDate
            ? 'Enter your date of birth'
            : yearsSince(birthDate) < MIN_AGE
                ? `You must be at least ${MIN_AGE} years old`
                : null,
        // Danish driving licences have an 8 digit number
        licenseNumber: !/^\d{8}$/.test(licenseNumber) ? 'License number must be 8 digits' : null,
        issueDate: !issueDate
            ? 'Enter the date your license was issued'
            : yearsSince(issueDate) < MIN_LICENSE_YEARS
                ? `You must have had your license for at least ${MIN_LICENSE_YEARS} year`
                : null,
        expiryDate: !expiryDate
            ? 'Enter the expiry date of your license'
            : expiryDate.getTime() < Date.now()
                ? 'Your license has expired'
                : null,
    };
    const noFieldErrors = { fullName: null, birthDate: null, licenseNumber: null, issueDate: null, expiryDate: null };
    const errors = {
        ...(VALIDATE_FIELDS ? fieldErrors : noFieldErrors),
        confirmed: !confirmed ? 'You must confirm that the information is correct' : null,
    };
    const isValid = Object.values(errors).every(e => e === null);

    function submit() {
        setSubmitted(true);
        if (!isValid) return;
        verify();
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={guard(() => navigation.goBack())} accessibilityLabel="Back" />
                <Text variant="titleLarge">Verify Account</Text>
            </View>
            {/* Shrinks the ScrollView by the part the keyboard covers, so every field can be scrolled to.
                Needed on Android too, since edge-to-edge means the window no longer resizes itself */}
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    {isVerified ? (
                        <Card 
                            mode="outlined">
                            <Card.Title 
                                title="Your account is verified" 
                                subtitle="You can book and drive cars"
                                left={props => <IconButton {...props} icon="check-decagram" />} />
                        </Card>
                    ) : (
                        <>
                            <Text variant="bodyMedium">
                                To rent a car we need to verify your driving license. Enter the details exactly as they appear on your license.
                            </Text>

                            <TextInput 
                                label="Full name" 
                                mode="outlined" 
                                value={fullName} 
                                onChangeText={setFullName}
                                autoComplete="name" 
                                error={submitted && !!errors.fullName} 
                            />
                            <HelperText 
                                type="error"
                                visible={submitted && !!errors.fullName}>{errors.fullName}
                            </HelperText>

                            <DatePickerInput 
                                locale="da" 
                                validRange={{endDate: new Date()}} 
                                label="Date of birth" 
                                mode="outlined" 
                                inputMode="start"
                                value={birthDate} 
                                onChange={setBirthDate} 
                                hasError={submitted && !!errors.birthDate} 
                            />
                            <HelperText 
                                type="error" 
                                visible={submitted && !!errors.birthDate}>{errors.birthDate}
                            </HelperText>

                            <TextInput 
                                label="License number" 
                                mode="outlined" value={licenseNumber}
                                onChangeText={text => setLicenseNumber(text.replace(/\D/g, ''))}
                                keyboardType="number-pad" 
                                maxLength={8} error={submitted && !!errors.licenseNumber} 
                            />
                            <HelperText 
                                type="error" 
                                visible={submitted && !!errors.licenseNumber}>{errors.licenseNumber}
                            </HelperText>

                            <DatePickerInput 
                                locale="da" 
                                validRange={{endDate: new Date()}} 
                                label="Issue date" 
                                mode="outlined" 
                                inputMode="start"
                                value={issueDate} 
                                onChange={setIssueDate} 
                                hasError={submitted && !!errors.issueDate} 
                            />
                            <HelperText 
                                type="error" 
                                visible={submitted && !!errors.issueDate}>{errors.issueDate}
                            </HelperText>

                            <DatePickerInput 
                                locale="da" 
                                validRange={{startDate: new Date()}} 
                                label="Expiry date" 
                                mode="outlined" 
                                inputMode="start"
                                value={expiryDate} 
                                onChange={setExpiryDate} 
                                hasError={submitted && !!errors.expiryDate} 
                            />
                            <HelperText 
                                type="error" 
                                visible={submitted && !!errors.expiryDate}>{errors.expiryDate}
                            </HelperText>

                            <View style={styles.checkboxRow}>
                                <Checkbox.Android 
                                    status={confirmed ? 'checked' : 'unchecked'} 
                                    onPress={() => setConfirmed(c => !c)} 
                                />
                                <Text 
                                    style={styles.checkboxLabel} 
                                    onPress={() => setConfirmed(c => !c)}>
                                    I confirm that the information is correct and that my license is valid
                                </Text>
                            </View>
                            <HelperText type="error" visible={submitted && !!errors.confirmed}>{errors.confirmed}</HelperText>

                            <Button mode="contained" icon="check-decagram" onPress={submit}>
                                Verify
                            </Button>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
