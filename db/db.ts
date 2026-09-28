import { type SQLiteDatabase } from 'expo-sqlite';
import { Car, NewCar } from './types';
import { addCar } from './dbcars'

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
    const DATABASE_VERSION = 3;

    const result = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );

    let currentDbVersion = result?.user_version ?? 0;
    console.log('Current DB version:', currentDbVersion);
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    // Initial database setup
    if (currentDbVersion === 0) {
        console.log('Migrating to version 1');
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            PRAGMA foreign_keys = 'ON';

            CREATE TABLE IF NOT EXISTS cars (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                make TEXT NOT NULL,
                model TEXT NOT NULL,
                price_per_day NUMBER NOT NULL DEFAULT 0,
                electric BOOLEAN
            );
        `);

        // Make some random car entries
        let carsToAdd: NewCar[] = [
            {
                make: "Volvo",
                model: "B18",
                price_per_day: 140,
                electric: false,
            },
            {
                make: "Toyota",
                model: "Yaris",
                price_per_day: 190,
                electric: false,
            },
            {
                make: "Mercedes",
                model: "S-Class Maybach",
                price_per_day: 900,
                electric: false,
            },
            {
                make: "VW",
                model: "Golf 3",
                price_per_day: 200,
                electric: false,

            },
            {
                make: "Skoda",
                model: "Octavia",
                price_per_day: 300,
                electric: false,
            },
        ]

        carsToAdd.forEach(element => {
            addCar(db, element);
        });

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                car_id INTEGER NOT NULL,
                FOREIGN KEY (car_id) REFERENCES cars(id)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS carThumbnails (
                image_id INTEGER NOT NULL,
                car_id INTEGER NOT NULL,
                PRIMARY KEY (image_id, car_id)
            );
        `);

        currentDbVersion = 1;
    }

    // Update database version
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}