import Landingpage from './components/landing';
import { BottomNavigation } from 'react-native-paper';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Profile from './components/profile';
import Bookings from './components/bookings';
import { connectToDatabase, createTables } from './db/db';
import { DbProvider } from './db/DBContext';

console.log({ Landingpage, Profile, Bookings, DbProvider, SafeAreaProvider, BottomNavigation })

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'search', title: 'Search', focusedIcon: 'car-search', unfocusedIcon: 'car-search' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account' },
    { key: 'bookings', title: 'My Bookings', focusedIcon: 'car-key', unfocusedIcon: 'car-key' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    search: Landingpage,
    profile: Profile,
    bookings: Bookings,
  });

  return (
    <DbProvider>
      <SafeAreaProvider>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </SafeAreaProvider>
    </DbProvider>
  );
}
