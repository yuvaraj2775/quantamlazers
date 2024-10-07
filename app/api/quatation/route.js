import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

async function opendb() {
    try {
        const db = await open({
            filename: './quo.db',
            driver: sqlite3.Database,
        });
        return db;
    } catch (e) {
        console.error("Error opening the database:", e);
        throw e;
    }
}

async function initdb() {
    try {
        const db = await opendb();
        await db.run(`
            CREATE TABLE IF NOT EXISTS quatationform (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                Quotation_id INTEGER,
                Address TEXT,
                Date TEXT,
                gstnumber TEXT,
                kindattention TEXT,
                reference TEXT,
                subject TEXT
            )
        `);

        await db.run(`
            CREATE TABLE IF NOT EXISTS quoitems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                Quotation_id INTEGER,
                description TEXT,
                hsncode TEXT,
                qty INTEGER,
                unit TEXT,
                taxableValue REAL,
                taxtype TEXT,
                percentage REAL,
                taxamt REAL,
                percentage2 REAL,
                taxamt2 REAL,
                FOREIGN KEY (Quotation_id) REFERENCES quatationform (id)
            )
        `);

        console.log("Created quotation tables");
        await db.close();
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

export async function POST(req) {
    let db;
    try {
        await initdb();
        const dts = await req.json();
        const {
            Address,
            Date,
            gstnumber,
            kindattention,
            reference,
            subject,
            items,  // Make sure this is part of the incoming JSON
        } = dts;

        if (!Address || !Date || !gstnumber || !kindattention || !reference || !subject || !items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        db = await opendb();

        const insertQuotation = `
            INSERT INTO quatationform (Address, Date, gstnumber, kindattention, reference, subject)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await db.run(insertQuotation, [
            Address,
            Date,
            gstnumber,
            kindattention,
            reference,
            subject
        ]);
        const quotationId = result.lastID;

        const insertItems = `
            INSERT INTO quoitems (Quotation_id, description, hsncode, qty, unit, taxableValue, taxtype, percentage, taxamt, percentage2, taxamt2)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (const item of items) {
            await db.run(insertItems, [
                quotationId,
                item.description,
                item.hsncode,
                item.qty,
                item.unit,
                item.taxableValue,
                item.taxtype,
                item.percentage,
                item.taxamt,
                item.percentage2,
                item.taxamt2,
            ]);
        }

        console.log("Inserted quotation and items successfully");
        return NextResponse.json({ message: "Data inserted successfully", quotationId });
    } catch (error) {
        console.error("Error during database operation:", error);
        return NextResponse.json(
            { error: "Database error: " + error.message },
            { status: 500 }
        );
    } finally {
        if (db) {
            await db.close();
            console.log("Closed the database");
        }
    }
}


