// navigation/tabContext.tsx
import { createContext, useContext } from 'react'

type TabContextValue = {
    goToBookings: () => void
    bookingsVersion: number // bumps every time we jump to Bookings
}

export const TabContext = createContext<TabContextValue>({
    goToBookings: () => {},
    bookingsVersion: 0,
})

export const useTabs = () => useContext(TabContext)