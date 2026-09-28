// dbbookings.ts
import * as SQLite from "expo-sqlite"

import { Booking, NewBooking } from "./types"

export const addBooking = async (
    db: SQLite.SQLiteDatabase,
    booking: NewBooking
) => {
    const insertQuery = await db.prepareAsync(`
        INSERT INTO bookings (car_id, start_date, end_date)
        VALUES (?, ?, ?)
    `);

    const values = [booking.car_id, booking.start_date, booking.end_date];

    try {
        return await insertQuery.executeAsync(values);
    } catch (error) {
        console.error(error)
        throw Error("Failed to add booking")
    } finally {
        await insertQuery.finalizeAsync();
    }
}

export const addBookingIfAvailable = async (
    db: SQLite.SQLiteDatabase,
    booking: NewBooking
): Promise<boolean> => {
    let booked = false;

    if (!(Date.parse(booking.end_date) > Date.parse(booking.start_date))) {
        return false;
    }

    await db.withExclusiveTransactionAsync(async (txn) => {
        const free = await isCarAvailable(txn, booking.car_id, booking.start_date, booking.end_date);
        if (!free) return;

        await addBooking(txn, booking);
        booked = true;
    });

    return booked;
}

export const getBookings = async (
    db: SQLite.SQLiteDatabase
): Promise<Booking[]> => {
    const query = await db.prepareAsync(`
        SELECT id, car_id, start_date, end_date
        FROM bookings
        ORDER BY start_date ASC
    `);

    try {
        const result = await query.executeAsync<Booking>();
        return await result.getAllAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to get bookings from database")
    } finally {
        await query.finalizeAsync();
    }
}

export const getBookingsForCar = async (
    db: SQLite.SQLiteDatabase,
    carId: number
): Promise<Booking[]> => {
    const query = await db.prepareAsync(`
        SELECT id, car_id, start_date, end_date
        FROM bookings
        WHERE car_id = ?
        ORDER BY start_date ASC
    `);

    try {
        const result = await query.executeAsync<Booking>(carId);
        return await result.getAllAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to get bookings for car")
    } finally {
        await query.finalizeAsync();
    }
}

export const getBooking = async (
    db: SQLite.SQLiteDatabase,
    id: number
): Promise<Booking | null> => {
    const query = await db.prepareAsync(`
        SELECT id, car_id, start_date, end_date
        FROM bookings
        WHERE id = ?
    `);

    try {
        const result = await query.executeAsync<Booking>(id);
        return await result.getFirstAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to get booking from database")
    } finally {
        await query.finalizeAsync();
    }
}

export const updateBooking = async (
    db: SQLite.SQLiteDatabase,
    updatedBooking: Booking
) => {

    const updateQuery = await db.prepareAsync(`
        UPDATE bookings
        SET car_id = ?, start_date = ?, end_date = ?
        WHERE id = ?
    `);

    const values = [
        updatedBooking.car_id,
        updatedBooking.start_date,
        updatedBooking.end_date,
        updatedBooking.id,
    ];

    try {
        return await updateQuery.executeAsync(values);
    } catch (error) {
        console.error(error)
        throw Error("Failed to update booking");
    } finally {
        await updateQuery.finalizeAsync();
    }
}

export const updateBookingIfAvailable = async (
    db: SQLite.SQLiteDatabase,
    booking: Booking
): Promise<boolean> => {
    let updated = false;

    if (!(Date.parse(booking.end_date) > Date.parse(booking.start_date))) {
        return false;
    }

    await db.withExclusiveTransactionAsync(async (txn) => {
        const free = await isCarAvailable(txn, booking.car_id, booking.start_date, booking.end_date, booking.id);
        if (!free) return;

        await updateBooking(txn, booking);
        updated = true;
    });

    return updated;
}

export const deleteBooking = async (
    db: SQLite.SQLiteDatabase,
    id: number
) => {
    const deleteQuery = await db.prepareAsync(`
        DELETE FROM bookings
        WHERE id = ?
    `);

    try {
        return await deleteQuery.executeAsync(id);
    } catch (error) {
        console.error(error)
        throw Error("Failed to remove booking")
    } finally {
        await deleteQuery.finalizeAsync();
    }
}

export const isCarAvailable = async (
    db: SQLite.SQLiteDatabase,
    carId: number,
    startDate: string,
    endDate: string,
    excludeBookingId: number = -1
): Promise<boolean> => {
    const query = await db.prepareAsync(`
        SELECT COUNT(*) AS count
        FROM bookings
        WHERE car_id = ?
          AND id != ?
          AND start_date < ?
          AND end_date > ?
    `);

    try {
        const result = await query.executeAsync<{ count: number }>([
            carId, excludeBookingId, endDate, startDate,
        ]);
        const row = await result.getFirstAsync();
        return (row?.count ?? 0) === 0;
    } catch (error) {
        console.error(error)
        throw Error("Failed to check car availability")
    } finally {
        await query.finalizeAsync();
    }
}