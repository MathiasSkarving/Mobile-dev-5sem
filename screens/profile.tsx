import { Button, Text, Avatar} from 'react-native-paper'
import { Dimensions} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/authContent';

export default function Profile() {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { logOut } = useAuth();

    return (
        <SafeAreaView>
            <Avatar.Icon size={windowWidth/3} icon="account" 
                style={{alignSelf: 'center', marginTop: windowHeight * 0.1}} />
            <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.05, fontSize: 20}}>
                Test User</Text>
            <Button mode="contained" icon="account-edit" onPress={() => console.log('Edit Profile')} 
            style={{alignSelf: 'center', marginTop: windowHeight * 0.05, width: windowWidth * 0.5}}>
                Edit Profile
            </Button>
            <Button mode="contained" icon="logout" onPress={logOut} 
            style={{alignSelf: 'center', marginTop: windowHeight * 0.02, width: windowWidth * 0.5}}>
                Logout
            </Button>
        </SafeAreaView>
    );
}