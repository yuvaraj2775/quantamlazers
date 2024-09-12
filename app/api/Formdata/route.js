import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

// Function to open the database (per request)
async function opendb() {
  try {
    const db = await open({
      filename: "./quotation.db",
      driver: sqlite3.Database,
    });
    return db;
  } catch (e) {
    console.error("Error opening database:", e);
    throw e;
  }
}

async function initDb() {
  try {
    const db = await opendb();
    await db.run(
      `CREATE TABLE IF NOT EXISTS quotation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buyer TEXT,
            dc_date DATE,
            vehicle_number TEXT,
            gst_number TEXT,
            dc_number TEXT,
            dc_issue_date DATE
        )`
    );
    console.log("Created 'quotation' table");
    await db.close(); // Close the database after initializing
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Handle POST request
export async function POST(req) {
  let db;
  try {
    await initDb(); // Ensure the database schema is initialized

    const data = await req.json();
    const { Buyer, docdate, vehiclenumber, gstnumber, dcnumber, dcdate } = data;

    if (
      !Buyer ||
      !docdate ||
      !vehiclenumber ||
      !gstnumber ||
      !dcnumber ||
      !dcdate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await opendb(); // Ensure database connection is open

    const insertSql = `
      INSERT INTO quotation (buyer, dc_date, vehicle_number, gst_number, dc_number, dc_issue_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.run(insertSql, [
      Buyer,
      docdate,
      vehiclenumber,
      gstnumber,
      dcnumber,
      dcdate,
    ]);

    return NextResponse.json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error during database operation:", error);
    return NextResponse.json(
      { error: "Database error: " + error.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close(); // Ensure the database connection is closed
      console.log("Closed the database connection.");
    }
  }
}

export async function GET() {
  let db;
  try {
    await initDb();
    db = await opendb();
    const selectSql = `SELECT * FROM quotation`;
    const data = await db.all(selectSql);
    return NextResponse.json({ data });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Database error: " + err.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close(); // Ensure the database connection is closed
      console.log("Closed the database connection.");
    }
  }
}
