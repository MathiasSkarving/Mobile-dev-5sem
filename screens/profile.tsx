import {Button, Text} from 'react-native-paper'
import {View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    return (
        <SafeAreaView>
            <Text >Logged in as: Test User</Text>
        </SafeAreaView>
    );
}