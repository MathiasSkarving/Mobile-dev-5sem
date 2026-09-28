import { Button, Text, TextInput} from 'react-native-paper';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { useAuth } from '../auth/authContent';


export default function Login() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

    const {logIn} = useAuth();

    return (
        <SafeAreaView>
            <Text style={{alignSelf: 'center', marginTop: windowHeight * 0.3, fontSize: 20}}>
                Login
            </Text>
            <TextInput label="Username" mode="outlined" style={{marginTop: windowHeight * 0.05, width: windowWidth * 0.8, alignSelf: 'center'}} />
            <TextInput label="Password" mode="outlined" secureTextEntry={true} style={{marginTop: windowHeight * 0.01, width: windowWidth * 0.8, alignSelf: 'center'}} />
            <Button mode="contained" onPress={logIn} style={{marginTop: windowHeight * 0.05, width: windowWidth * 0.8, alignSelf: 'center'}}>
                Login
            </Button>
            <Button mode="text" onPress={() => console.log('Forgot Password')} style={{marginTop: windowHeight * 0.01, width: windowWidth * 0.8, alignSelf: 'center'}}>
                Forgot Password?
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Signup')} style={{marginTop: windowHeight * 0.01, width: windowWidth * 0.8, alignSelf: 'center'}}>
                Don't have an account? Sign Up
            </Button>
        </SafeAreaView>
    )
}