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

// Initialize database tables
async function initDb() {
  try {
    const db = await opendb();

    await db.run(`
      CREATE TABLE IF NOT EXISTS quotation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer TEXT,
        dc_date DATE,
        vehicle_number TEXT,
        gst_number TEXT,
        dc_number TEXT,
        dc_issue_date DATE
         
      )
    `);
    console.log("Created 'quotation' table");

    await db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_id INTEGER,
        name TEXT,
        hsn TEXT,
        qty INTEGER,
        umoremarks TEXT,
        remarks TEXT,
        FOREIGN KEY (quotation_id) REFERENCES quotation (id)
      )
    `);
    console.log("Created 'items' table");

    await db.close(); // Close the database after initializing
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
export async function POST(req) {
  let db;
  try {
    await initDb(); // Ensure the database schema is initialized

    const data = await req.json();
    const {
      Buyer,
      docdate,
      vehiclenumber,
      gstnumber,
      dcnumber,
      dcdate,
      items,
    } = data;

    if (
      !Buyer ||
      !docdate ||
      !vehiclenumber ||
      !gstnumber ||
      !dcnumber ||
      !dcdate ||
      !items
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await opendb(); // Ensure database connection is open

    // Insert into `quotation` table
    const insertQuotationSql = `
      INSERT INTO quotation (buyer, dc_date, vehicle_number, gst_number, dc_number, dc_issue_date)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const result = await db.run(insertQuotationSql, [
      Buyer,
      docdate,
      vehiclenumber,
      gstnumber,
      dcnumber,
      dcdate,
    ]);

    // Retrieve the ID of the inserted quotation
    const quotationId = result.lastID;

    // Prepare SQL for inserting items
    const insertItemSql = `
      INSERT INTO items ( quotation_id,name, hsn, qty, umoremarks, remarks)
      VALUES ( ?,?, ?, ?, ?, ?);
    `;

    // Insert items
    for (const item of items) {
      await db.run(insertItemSql, [
        quotationId,
        item.name,
        item.hsn,
        item.qty,
        item.umoremarks,
        item.remarks,
      ]);
    }

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

// Handle GET request for quotations
export async function GET() {
  let db;
  try {          
    await initDb(); // Ensure the database schema is initialized 
    
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
