import { type SQLiteDatabase } from 'expo-sqlite';
import { NewCar } from './types';
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
                electric BOOLEAN,
                promotional_text TEXT
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
                promotional_text: "Check the price!",
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
                model: "Golf 7 GTI",
                price_per_day: 500,
                electric: false,
                promotional_text: "Popular!",
            },
            {
                make: "Skoda",
                model: "Octavia",
                price_per_day: 300,
                electric: false,
            },
            {
                make: "Hyundai",
                model: "i10",
                price_per_day: 273,
                electric: false,
            },
            {
                make: "Ford",
                model: "Fiesta",
                price_per_day: 242,
                electric: false,
                promotional_text: "Get this now!"
            },
            {
                make: "Mini",
                model: "Cooper",
                price_per_day: 492,
                electric: false,
            },
            {
                make: "Fiat",
                model: "500",
                price_per_day: 222,
                electric: false,
            },
            {
                make: "BMW",
                model: "5 Series",
                price_per_day: 542,
                electric: false,
            },
            {
                make: "Tesla",
                model: "Model 3",
                price_per_day: 487,
                electric: true,
            },
        ]

        // Seed images, keyed by make, so each car gets a matching placeholder
        const imageUrlsByMake: Record<number, string[]> = {
            0: [
                "https://images.unsplash.com/photo-1610884447640-42b8ec61a933?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            1: [
                "https://images.unsplash.com/photo-1762097359769-c4588ac7b759?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            2: [
                "https://images.unsplash.com/photo-1624085568108-36410cfe4d24?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            3: [
                "https://images.unsplash.com/flagged/photo-1571380513450-edea6ae8344a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            4: [
                "https://images.unsplash.com/photo-1594502167666-3e87b8c16343?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            5: [
                "https://d147al5y0i1rb.cloudfront.net/uploads/car_picture/image/998998/car_fb7635f9-1200-47dd-a695-2e8823aeb8b5.jpg?w=800"
            ],
            6: [
                "https://d147al5y0i1rb.cloudfront.net/uploads/car_picture/image/2090474/car_1780141208.jpg?w=800"
            ],
            7: [
                "https://d147al5y0i1rb.cloudfront.net/uploads/car_picture/image/2199076/car_1784182789.jpg?w=800"
            ],
            8: [
                "https://d147al5y0i1rb.cloudfront.net/uploads/car_picture/image/1981479/car_1775500737.jpg?w=800"
            ],
            9: [
                "https://d147al5y0i1rb.cloudfront.net/uploads/car_picture/image/424733/car_6c7fe65c-19cf-4c26-a012-c9eefd1a5d4c.jpg?w=800"
            ],
            10: [
                "https://d147al5y0i1rb.cloudfront.net/uploads/car_picture/image/1185730/car_1740673244.jpeg?w=800"
            ]

        };

        let index = 0;

        for (const car of carsToAdd) {
            const insertResult = await addCar(db, car);
            const carId = insertResult.lastInsertRowId;

            const imageUrls = imageUrlsByMake[index] ?? [];
            for (let i = 0; i < imageUrls.length; i++) {
                const imgResult = await addImage(db, imageUrls[i], carId);
                if (i === 0) {
                    await setThumbnail(db, carId, imgResult.lastInsertRowId);
                }
            }
            index++;
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