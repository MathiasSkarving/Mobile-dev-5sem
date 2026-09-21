import * as SQLite from "expo-sqlite"

import { Car, NewCar } from "./types"

export const addCar = async (
    db: SQLite.SQLiteDatabase,
    car: NewCar
) => {
    const insertQuery = `
        INSERT INTO Cars (name, price)
        VALUES (?, ?)
    `

    const values = [car.carName, car.pricePerDay]

    try {
        return await db.runAsync(insertQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to add car")
    }
}

export const getCars = async (
    db: SQLite.SQLiteDatabase,
): Promise<Car[]> => {
    const query = `
        SELECT id, name AS carName, price AS pricePerDay
        FROM Cars
    `

    try {
        return await db.getAllAsync<Car>(query)
    } catch (error) {
        console.error(error)
        throw Error("Failed to get cars from database")
    }
}

export const deleteCar = async (
    db: SQLite.SQLiteDatabase,
    id: number
) => {
    const deleteQuery = `
        DELETE FROM Cars
        WHERE id = ?
    `

    try {
        return await db.runAsync(deleteQuery, [id])
    } catch (error) {
        console.error(error)
        throw Error("Failed to remove car")
    }
}

export const updateCar = async (
    db: SQLite.SQLiteDatabase,
    updatedCar: Car
) => {
    const updateQuery = `
        UPDATE Cars
        SET name = ?, price = ?
        WHERE id = ?
    `

    const values = [
        updatedCar.carName,
        updatedCar.pricePerDay,
        updatedCar.id,
    ]

    try {
        return await db.runAsync(updateQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to update car")
    }
}