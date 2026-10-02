import { Button, Text, Avatar} from 'react-native-paper'
import { Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { useAuth } from '../auth/authContent';
import { useTransitionGuard } from '../navigation/useTransitionGuard';

export default function Profile() {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
    const guard = useTransitionGuard();

    const { logOut, isVerified } = useAuth();

    return (
        <SafeAreaView>
            <Avatar.Icon size={windowWidth/3} icon="account"
                style={{alignSelf: 'center', marginTop: windowHeight * 0.1}} />
            <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.05, fontSize: 20}}>
                Test User</Text>
            <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.01}}>
                {isVerified ? 'Verified driver' : 'Not verified'}</Text>
            <Button mode="contained" icon="account-edit" onPress={() => console.log('Edit Profile')}
            style={{alignSelf: 'center', marginTop: windowHeight * 0.05, width: windowWidth * 0.5}}>
                Edit Profile
            </Button>
            <Button mode={isVerified ? 'outlined' : 'contained'} icon="check-decagram" onPress={guard(() => navigation.navigate('Verification'))}
            style={{alignSelf: 'center', marginTop: windowHeight * 0.02, width: windowWidth * 0.5}}>
                {isVerified ? 'Verified' : 'Verify Account'}
            </Button>
            <Button mode="contained" icon="logout" onPress={logOut}
            style={{alignSelf: 'center', marginTop: windowHeight * 0.02, width: windowWidth * 0.5}}>
                Logout
            </Button>
        </SafeAreaView>
    );
}
