import { useState } from 'react';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from './components/search';
import Login from './components/login';
import SignupScreen from './components/signup';
import Bookings from './components/bookings';
import { ProfileStackParamList } from './navigation/types';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileTab() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Login" component={Login} />
      <ProfileStack.Screen name="Signup" component={SignupScreen} />
    </ProfileStack.Navigator>
  );
}

const renderScene = BottomNavigation.SceneMap({
  search: Search,
  profile: ProfileTab,
  bookings: Bookings,
});

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'search', title: 'Search', focusedIcon: 'car-search', unfocusedIcon: 'car-search' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account' },
    { key: 'bookings', title: 'My Bookings', focusedIcon: 'car-key', unfocusedIcon: 'car-key' },
  ]);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
          />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}