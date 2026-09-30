import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from './screens/search';
import Login from './screens/login';
import SignupScreen from './screens/signup';
import Profile from './screens/profile';
import Verification from './components/verification';
import Bookings from './screens/bookings';
import Checkout from './screens/checkout';
import CarDetails from './screens/carDetails';
import { BookingsStackParamList, CarsStackParamList, ProfileStackParamList } from './navigation/types';
import { View } from 'react-native';
import { DatabaseProvider } from './db/dbprovider';
import { AuthProvider, useAuth } from './auth/authContent';
import { TabContext, useTabs } from './navigation/tabContext';

// Paper's BottomNavigation is not a React Navigation navigator,
// so each tab's stack needs its own container
function TabContainer({ children }: { children: ReactNode }) {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>{children}</NavigationContainer>
    </NavigationIndependentTree>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileTab() {
  const { isLoggedIn } = useAuth();
  return (
    <TabContainer>
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <ProfileStack.Screen name="Profile" component={Profile} />
            <ProfileStack.Screen name="Verification" component={Verification} />
          </>
        ) : (
          <>
            <ProfileStack.Screen name="Login" component={Login} />
            <ProfileStack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </ProfileStack.Navigator>
    </TabContainer>
  );
}

const CarsStack = createNativeStackNavigator<CarsStackParamList>();

function CarsTab() {
  return (
    <TabContainer>
      <CarsStack.Navigator>
        <CarsStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <CarsStack.Screen name="Checkout" component={Checkout} />
        <CarsStack.Screen name="CarDetails" component={CarDetails} options={{ title: 'Details' }} />
      </CarsStack.Navigator>
    </TabContainer>
  );
}

const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();

function BookingsTab() {
  return (
    <TabContainer>
      <BookingsStack.Navigator>
        <BookingsStack.Screen name="Bookings" component={Bookings} options={{ headerShown: false }} />
      </BookingsStack.Navigator>
    </TabContainer>
  );
}

// Lives inside AuthProvider (App itself can't use useAuth), and sends the user
// back to Checkout once they are allowed to book
function ReturnToCheckout({ pending, onReturn }: { pending: boolean; onReturn: () => void }) {
  const { isLoggedIn, isVerified } = useAuth();
  useEffect(() => {
    if (pending && isLoggedIn && isVerified) onReturn();
  }, [pending, isLoggedIn, isVerified, onReturn]);
  return null;
}

const renderScene = BottomNavigation.SceneMap({
  search: CarsTab,
  profile: ProfileTab,
  bookings: BookingsTab,
});

export default function App() {
  const [index, setIndex] = useState(0);
  const [bookingsVersion, setBookingsVersion] = useState(0);
  const [routes] = useState([
    { key: 'search', title: 'Search', focusedIcon: 'car-search', unfocusedIcon: 'car-search' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account' },
    { key: 'bookings', title: 'My Bookings', focusedIcon: 'car-key', unfocusedIcon: 'car-key' },
  ]);

  const tabContext = useTabs();
  
  const goToBookings = useCallback(() => {
    setIndex(routes.findIndex(r => r.key === 'bookings'));
    setBookingsVersion(v => v + 1);
  }, [routes]);

  // Set when Checkout sends the user to log in / verify, so we can bring them back afterwards
  const [returnToCheckout, setReturnToCheckout] = useState(false);

  const goToProfile = useCallback(() => {
    setIndex(routes.findIndex(r => r.key === 'profile'));
    setReturnToCheckout(true);
  }, [routes]);

  const backToCheckout = useCallback(() => {
    // Checkout is still on top of the Cars stack, so switching tab is enough
    setIndex(routes.findIndex(r => r.key === 'search'));
    setReturnToCheckout(false);
  }, [routes]);

  // Picking a tab manually means the user gave up on the booking
  const onIndexChange = useCallback((i: number) => {
    setIndex(i);
    setReturnToCheckout(false);
  }, []);

  return (
    <PaperProvider>    
      <AuthProvider>
        <DatabaseProvider>
          <SafeAreaProvider style={{ flex: 1 }}>
            <TabContext.Provider value={{ goToBookings, goToProfile, bookingsVersion }}>
              <ReturnToCheckout pending={returnToCheckout} onReturn={backToCheckout} />
              <View style={{ flex: 1 }}>
                <BottomNavigation
                  navigationState={{ index, routes }}
                  onIndexChange={onIndexChange}
                  renderScene={renderScene}
                />
              </View>
            </TabContext.Provider>
          </SafeAreaProvider>
        </DatabaseProvider>
      </AuthProvider>
    </PaperProvider >
  );
}