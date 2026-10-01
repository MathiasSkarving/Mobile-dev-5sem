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
                make: "Mazda",
                model: "Miata",
                price_per_day: 290,
                electric: false,
            },
            {
                make: "Toyota",
                model: "Supra",
                price_per_day: 490,
                electric: false,
            },
            {
                make: "Mercedes-Benz",
                model: "E-Klasse AMG",
                price_per_day: 600,
                electric: false,
            },
            {
                make: "Volkswagen",
                model: "Golf 4 GTI",
                price_per_day: 500,
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
            Mazda: [
                "https://images.unsplash.com/photo-1610884447640-42b8ec61a933?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            Toyota: [
                "https://images.unsplash.com/photo-1762097359769-c4588ac7b759?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            'Mercedes-Benz': [
                "https://images.unsplash.com/photo-1624085568108-36410cfe4d24?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            Volkswagen: [
                "https://images.unsplash.com/flagged/photo-1571380513450-edea6ae8344a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            Skoda: [
                "https://images.unsplash.com/photo-1594502167666-3e87b8c16343?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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