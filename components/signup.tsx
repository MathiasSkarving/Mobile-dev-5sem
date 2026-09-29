import { Button, IconButton, Text, TextInput} from 'react-native-paper'
import { Dimensions, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { useAuth } from '../auth/authContent';
import { useTransitionGuard } from '../navigation/useTransitionGuard';

export default function SignupScreen() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const guard = useTransitionGuard();
    
    const { logIn } = useAuth();

    return (
        <SafeAreaView>
            {/* Wrapper so the absolute icon is placed inside the safe area */}
            <View>
                {/* Absolute so the icon doesn't push the content down - keeps it aligned with Login */}
                <IconButton icon="arrow-left" onPress={guard(() => navigation.goBack())} accessibilityLabel="Back" style={{position: 'absolute', top: windowHeight * 0.01, left: 0, zIndex: 1}} />
                <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.3, fontSize: 20}}>
                    Sign Up
                </Text>
                <TextInput label="Username" mode="outlined" style={{marginTop: windowHeight * 0.05, width: windowWidth * 0.8, alignSelf: 'center'}} />
                <TextInput label="Password" mode="outlined" secureTextEntry={true} style={{marginTop: windowHeight * 0.01, width: windowWidth * 0.8, alignSelf: 'center'}} />
                <Button mode="contained" onPress={logIn} style={{marginTop: windowHeight * 0.05, width: windowWidth * 0.8, alignSelf: 'center'}}>
                    Sign Up
                </Button>
                <Button mode="text" onPress={guard(() => navigation.goBack())} style={{marginTop: windowHeight * 0.01, width: windowWidth * 0.8, alignSelf: 'center'}}>
                    login instead
                </Button>
            </View>
        </SafeAreaView>
    )
}