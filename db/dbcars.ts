import * as SQLite from "expo-sqlite"

import { Car, CarWithThumbnail, NewCar } from "./types"
import { List } from "react-native-paper";

export const addCar = async (
    db: SQLite.SQLiteDatabase,
    car: NewCar
) => {
    const insertQuery = await db.prepareAsync(`
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

export const getAvailableCarsFromSearchQuery = async (
    db: SQLite.SQLiteDatabase,
    searchQuery: string,
    startDate: string,
    endDate: string
): Promise<Car[]> => {
    const term = `%${searchQuery}%`;

    const query = await db.prepareAsync(`
    SELECT c.* FROM cars c
    WHERE (c.make LIKE $term OR c.model LIKE $term OR c.price_per_day LIKE $term)
      AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.car_id = c.id
          AND b.start_date < $end
          AND b.end_date   > $start
      )
    `);

    try {
        const result = await query.executeAsync<Car>({
            $term: term,
            $start: startDate,
            $end: endDate,
        });
        return await result.getAllAsync();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get cars from database");
    } finally {
        await query.finalizeAsync();
    }
}

export const getCarsWithThumbnails = async (
    db: SQLite.SQLiteDatabase,
): Promise<CarWithThumbnail[]> => {
    const query = await db.prepareAsync(
        `SELECT c.*, i.url AS thumbnail_url
         FROM cars c
         LEFT JOIN carThumbnails t ON t.car_id = c.id
         LEFT JOIN images i ON i.id = t.image_id`
    );

    try {
        const result = await query.executeAsync<CarWithThumbnail>();
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
    const deleteQuery = await db.prepareAsync(`
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
    const updateQuery = await db.prepareAsync(`
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