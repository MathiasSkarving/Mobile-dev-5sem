// navigation/tabContext.tsx
import { createContext, useContext } from 'react'

type TabContextValue = {
    goToBookings: () => void
    goToProfile: () => void
    bookingsVersion: number // bumps every time we jump to Bookings
}

export const TabContext = createContext<TabContextValue>({
    goToBookings: () => {},
    goToProfile: () => {},
    bookingsVersion: 0,
})

export const useTabs = () => useContext(TabContext)
