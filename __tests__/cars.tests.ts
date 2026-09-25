import * as SQLite from "expo-sqlite"

import {
    addCar,
    getCars,
    updateCar,
    deleteCar,
} from '../db/dbcars'

describe("Cars database functions", () => {
    let db: SQLite.SQLiteDatabase

    beforeEach(() => {
        db = {
            runAsync: jest.fn(),
            getAllAsync: jest.fn(),
        } as unknown as SQLite.SQLiteDatabase
    })

    test("addCar inserts a car", async () => {
        await addCar(db, {
            carName: "VW Golf",
            pricePerDay: 58,
        })

        expect(db.runAsync).toHaveBeenCalledWith(
            expect.stringContaining(
                "INSERT INTO Cars (name, price)"
            ),
            ["VW Golf", 58]
        )
    })

    test("getCars returns cars", async () => {
        const cars = [
            {
                id: 1,
                carName: "VW Golf",
                pricePerDay: 58,
            },
            {
                id: 2,
                carName: "Toyota Yaris",
                pricePerDay: 48,
            },
        ]

        ;(db.getAllAsync as jest.Mock).mockResolvedValue(cars)

        const result = await getCars(db)

        expect(db.getAllAsync).toHaveBeenCalledWith(
            expect.stringContaining("SELECT id, name AS carName")
        )

        expect(result).toEqual(cars)
    })

    test("updateCar updates a car", async () => {
        const car = {
            id: 1,
            carName: "VW Golf GTI",
            pricePerDay: 75,
        }

        await updateCar(db, car)

        expect(db.runAsync).toHaveBeenCalledWith(
            expect.stringContaining(
                "UPDATE Cars"
            ),
            ["VW Golf GTI", 75, 1]
        )
    })

    test("deleteCar deletes a car", async () => {
        await deleteCar(db, 1)

        expect(db.runAsync).toHaveBeenCalledWith(
            expect.stringContaining(
                "DELETE FROM Cars"
            ),
            [1]
        )
    })
})