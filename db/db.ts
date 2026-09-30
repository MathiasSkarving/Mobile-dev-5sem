import { type SQLiteDatabase } from 'expo-sqlite';
import { Car, NewCar } from './types';
import { addCar } from './dbcars'
import { addImage, setThumbnail } from './dbimages'

const RESET_DB_ON_START = __DEV__; // flip to false to keep data between launches

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
    const DATABASE_VERSION = 3;

    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        PRAGMA foreign_keys = ON;
    `);
    
    if (RESET_DB_ON_START) {
        await db.execAsync(`
            PRAGMA foreign_keys = OFF;
            DROP TABLE IF EXISTS bookings;
            DROP TABLE IF EXISTS carThumbnails;
            DROP TABLE IF EXISTS images;
            DROP TABLE IF EXISTS cars;
            PRAGMA user_version = 0;
            PRAGMA foreign_keys = ON;
        `);
    }

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
            CREATE TABLE IF NOT EXISTS cars (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                make TEXT NOT NULL,
                model TEXT NOT NULL,
                price_per_day NUMBER NOT NULL DEFAULT 0,
                electric BOOLEAN
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                car_id INTEGER NOT NULL,
                FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS carThumbnails (
                car_id INTEGER PRIMARY KEY,
                image_id INTEGER NOT NULL,
                FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
                FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
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

        // Seed images, keyed by make, so each car gets a matching placeholder
        const imageUrlsByMake: Record<string, string[]> = {
            Volvo: [
                "https://picsum.photos/seed/volvo-b18-1/800/600",
                "https://picsum.photos/seed/volvo-b18-2/800/600",
            ],
            Toyota: [
                "https://picsum.photos/seed/toyota-yaris-1/800/600",
            ],
            Mercedes: [
                "https://picsum.photos/seed/mercedes-maybach-1/800/600",
                "https://picsum.photos/seed/mercedes-maybach-2/800/600",
            ],
            VW: [
                "https://picsum.photos/seed/vw-golf3-1/800/600",
            ],
            Skoda: [
                "https://picsum.photos/seed/skoda-octavia-1/800/600",
            ],
        };

        for (const car of carsToAdd) {
            const insertResult = await addCar(db, car);
            const carId = insertResult.lastInsertRowId;

            const imageUrls = imageUrlsByMake[car.make] ?? [];
            for (let i = 0; i < imageUrls.length; i++) {
                const imgResult = await addImage(db, imageUrls[i], carId);
                if (i === 0) {
                    await setThumbnail(db, carId, imgResult.lastInsertRowId);
                }
            }
        }

        currentDbVersion = 1;
    }
    if (currentDbVersion === 1) {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                car_id INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                price_per_day INTEGER NOT NULL,
                total_price INTEGER NOT NULL,
                image TEXT NOT NULL,
                FOREIGN KEY(car_id) REFERENCES cars(id)
            );
        `);
        currentDbVersion = 2;
    }

    // Update database version
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}