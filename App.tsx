import { BottomNavigation, Icon, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Search from './components/search';
import Login from './components/login';
import SignupScreen from './components/signup';
import Profile from './components/profile';
import Verification from './components/verification';
import Bookings from './components/bookings';
import Checkout from './components/checkout';
import CarDetails from './components/carDetails';
import {
  BookingsStackParamList,
  CarsStackParamList,
  ProfileStackParamList,
  RootTabParamList,
} from './navigation/types';
import { DatabaseProvider } from './db/dbprovider';
import { AuthProvider, useAuth } from './auth/authContent';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileTab() {
  const { isLoggedIn } = useAuth();
  return (
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
  );
}

const CarsStack = createNativeStackNavigator<CarsStackParamList>();

function CarsTab() {
  return (
    <CarsStack.Navigator>
      <CarsStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <CarsStack.Screen name="Checkout" component={Checkout} />
      <CarsStack.Screen name="CarDetails" component={CarDetails} options={{ title: 'Details' }} />
    </CarsStack.Navigator>
  );
}

const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();

function BookingsTab() {
  return (
    <BookingsStack.Navigator screenOptions={{ headerShown: false }}>
      <BookingsStack.Screen name="Bookings" component={Bookings} />
    </BookingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <DatabaseProvider>
          <SafeAreaProvider style={{ flex: 1 }}>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{ headerShown: false }}
                // Paper's bar keeps the Material look, while React Navigation handles the tabs
                tabBar={({ navigation, state, descriptors, insets }) => (
                  <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route, preventDefault }) => {
                      const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                      });
                      if (event.defaultPrevented) {
                        preventDefault();
                      } else {
                        navigation.dispatch({
                          ...CommonActions.navigate(route.name, route.params),
                          target: state.key,
                        });
                      }
                    }}
                    renderIcon={({ route, focused, color }) =>
                      descriptors[route.key].options.tabBarIcon?.({ focused, color, size: 24 }) ?? null
                    }
                    getLabelText={({ route }) => descriptors[route.key].options.title}
                  />
                )}
              >
                <Tab.Screen
                  name="SearchTab"
                  component={CarsTab}
                  options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => <Icon source="car-search" color={color} size={size} />,
                  }}
                />
                <Tab.Screen
                  name="ProfileTab"
                  component={ProfileTab}
                  options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Icon source="account" color={color} size={size} />,
                  }}
                />
                <Tab.Screen
                  name="BookingsTab"
                  component={BookingsTab}
                  options={{
                    title: 'My Bookings',
                    tabBarIcon: ({ color, size }) => <Icon source="car-key" color={color} size={size} />,
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </DatabaseProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
