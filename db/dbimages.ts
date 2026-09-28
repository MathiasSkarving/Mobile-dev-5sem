import * as SQLite from "expo-sqlite"

import { CarImage } from "./types"

export const addImage = async (
    db: SQLite.SQLiteDatabase,
    url: string,
    carId: number
) => {
    const insertQuery = await db.prepareAsync(`
        INSERT INTO images (url, car_id)
        VALUES (?, ?)
    `);

    const values = [url, carId];

    try {
        return await insertQuery.executeAsync(values);
    } catch (error) {
        console.error(error)
        throw Error("Failed to add image")
    } finally {
        await insertQuery.finalizeAsync();
    }
}

export const getImages = async (
    db: SQLite.SQLiteDatabase,
    carId: number
): Promise<CarImage[]> => {
    const query = await db.prepareAsync(`
        SELECT id, url, car_id
        FROM images
        WHERE car_id = ?
    `);

    try {
        const result = await query.executeAsync<CarImage>(carId);
        return await result.getAllAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to get images from database")
    } finally {
        await query.finalizeAsync();
    }
}

export const getFirstImage = async (
    db: SQLite.SQLiteDatabase,
    carId: number
): Promise<CarImage | null> => {
    const query = await db.prepareAsync(`
        SELECT id, url, car_id
        FROM images
        WHERE car_id = ?
        ORDER BY id ASC
        LIMIT 1
    `);

    try {
        const result = await query.executeAsync<CarImage>(carId);
        return await result.getFirstAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to get first image from database")
    } finally {
        await query.finalizeAsync();
    }
}

export const deleteImage = async (
    db: SQLite.SQLiteDatabase,
    id: number
) => {
    const deleteQuery = await db.prepareAsync(`
        DELETE FROM images
        WHERE id = ?
    `);

    try {
        return await deleteQuery.executeAsync(id);
    } catch (error) {
        console.error(error)
        throw Error("Failed to remove image")
    } finally {
        await deleteQuery.finalizeAsync();
    }
}

export const updateImage = async (
    db: SQLite.SQLiteDatabase,
    updatedImage: CarImage
) => {
    const updateQuery = await db.prepareAsync(`
        UPDATE images
        SET url = ?, car_id = ?
        WHERE id = ?
    `);

    const values = [
        updatedImage.url,
        updatedImage.car_id,
        updatedImage.id,
    ];

    try {
        return await updateQuery.executeAsync(values);
    } catch (error) {
        console.error(error)
        throw Error("Failed to update image");
    } finally {
        await updateQuery.finalizeAsync();
    }
}