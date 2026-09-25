import * as SQLite from "expo-sqlite"

import { Car, NewCar } from "./types"

export const addCar = async (
    db: SQLite.SQLiteDatabase,
    car: NewCar
) => {
    const insertQuery = await db.prepareAsync( `
        INSERT INTO cars (make, model, price_per_day, electric)
        VALUES (?, ?, ?, ?)
    `);

    const values = [car.make, car.model, car.price_per_day, car.electric];

    try {
        return await insertQuery.executeAsync(values);
    } catch (error) {
        console.error(error)
        throw Error("Failed to add car")
    } finally {
        insertQuery.finalizeAsync();
    }
}

export const getCars = async (
    db: SQLite.SQLiteDatabase,
): Promise<Car[]> => {
    const query = await db.prepareAsync(`
        SELECT id, make, model, price_per_day, electric
        FROM cars
    `);

    try {
        const result = await query.executeAsync<Car>();
        return await result.getAllAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to get cars from database")
    } finally {
        await query.finalizeAsync();
    }
}

export const deleteCar = async (
    db: SQLite.SQLiteDatabase,
    id: number
) => {
    const deleteQuery = await db.prepareAsync( `
        DELETE FROM cars
        WHERE id = ?
    `);

    try {
        return await deleteQuery.executeAsync(id);
    } catch (error) {
        console.error(error)
        throw Error("Failed to remove car")
    } finally {
        await deleteQuery.finalizeAsync();
    }
}

export const updateCar = async (
    db: SQLite.SQLiteDatabase,
    updatedCar: Car
) => {
    const updateQuery = await db.prepareAsync( `
        UPDATE cars
        SET make = ?, model = ?, price_per_day = ?
        WHERE id = ?
    `);

    const values = [
        updatedCar.make,
        updatedCar.model,
        updatedCar.price_per_day,
        updatedCar.id,
    ];

    try {
        return await updateQuery.executeAsync(values);
    } catch (error) {
        console.error(error)
        throw Error("Failed to update car");
    } finally {
        await updateQuery.finalizeAsync();
    }
}