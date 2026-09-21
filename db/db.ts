import * as SQLite from "expo-sqlite"

import { Table } from "./types"

export const createTables = async (db: SQLite.SQLiteDatabase) => {
    const carTableQuery = `
        CREATE TABLE IF NOT EXISTS Cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price FLOAT
        )
    `

    try {
        await db.execAsync(carTableQuery)
    } catch (error) {
        console.error(error)
        throw Error("Failed to create tables")
    }
}

export const getTableNames = async (
    db: SQLite.SQLiteDatabase
): Promise<string[]> => {
    try {
        const results = await db.getAllAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )

        return results.map(result => result.name)
    } catch (error) {
        console.error(error)
        throw Error("Failed to get table names from database")
    }
}

export const removeTable = async (
    db: SQLite.SQLiteDatabase,
    tableName: Table
) => {
    const query = `DROP TABLE IF EXISTS ${tableName}`

    try {
        await db.execAsync(query)
    } catch (error) {
        console.error(error)
        throw Error(`Failed to drop table ${tableName}`)
    }
}

export const connectToDatabase = async () => {
    return await SQLite.openDatabaseAsync("ogcarrentaldatabase.db")
}