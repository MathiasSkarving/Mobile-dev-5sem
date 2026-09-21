import React, { createContext, useContext, useEffect, useState } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import * as SQLite from "expo-sqlite"
import { connectToDatabase, createTables } from "./db"

interface DbContextType {
    db: SQLite.SQLiteDatabase | null
}

const DbContext = createContext<DbContextType>({ db: null })

export function useDb(): SQLite.SQLiteDatabase {
    const { db } = useContext(DbContext)
    if (!db) throw new Error("useDb must be used within a DbProvider wrapper")
    return db
}

export function DbProvider({ children }: { children: React.ReactNode }) {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)

    const value: DbContextType = {
        db
    }

    useEffect(() => {
        connectToDatabase()
            .then(async (database) => {
                await createTables(database)
                setDb(database)
            })
            .catch(console.error)
    }, [])

    if (!db) return null
    return <DbContext.Provider value={value}>{children}</DbContext.Provider>
}