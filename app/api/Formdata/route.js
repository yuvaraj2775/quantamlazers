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
      CREATE TABLE IF NOT EXISTS dcform (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_id INTEGER
        buyer TEXT,
        dc_date DATE,
        vehicle_number TEXT,
        gst_number TEXT,
        dc_number INT,
        dc_issue_date TEXT,
      )
    `);
    console.log("Created 'dcform' table");

    await db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_id INTEGER  REFERENCE  quotation(id),
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

    db = await opendb(); 

    
    const insertQuotationSql = `
      INSERT INTO quotation ( buyer, dc_date, vehicle_number, gst_number, dc_number, dc_issue_date)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const result = await db.run(insertQuotationSql, [
      Buyer,
      docdate,
      vehiclenumber,
      gstnumber,
      dcnumber,
      dcdate
    ]);
    

    // Retrieve the ID of the inserted quotation
    const quotationId = result.lastID;
    

    // Prepare SQL for inserting items
    const insertItemSql = `
      INSERT INTO items (quotation_id, name, hsn, qty, umoremarks, remarks)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    // Insert items
    for (const item of items) {
      await db.run(insertItemSql, [
        quotationId,
        item.name,
        item.hsn,
        item.qty,
        item.umoremarks,
        item.remarks 
        
      ]);
    }
    console.log("fetched data")

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
export async function GET(request) {
  let db;
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const quotation_id = params.get("quotation_id");

    db = await opendb(); // Open the database

    // Sample SQL queries, adjust as necessary
    const selectSql = `SELECT * FROM quotation ORDER by id DESC LIMIT 1 `; // First SQL query
    const selectSql2 =` SELECT *
    FROM items
    WHERE quotation_id = (SELECT MAX(quotation_id) FROM items)`;
    ; // Second SQL query

    const data = await db.all(selectSql);
    const data2 = await db.all(selectSql2);

    // If you want to return the data regardless of quotation_id
    return NextResponse.json({ data, data2 });

  } catch (error) {
    console.error("Error retrieving data:", error);
    return new Response(
      JSON.stringify({ error: "Error retrieving data" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  } finally {
    if (db) {
      await db.close(); // Ensure the database connection is closed
      console.log("Closed the database connection.");
    }
  }
}
export async function PUT(req) {
  let db;
  try {
    const data = await req.json();
    console.log("Received data:", data); // Log received data

    const { quotation_id, ...formData } = data;

    db = await opendb(); // Open the database

    // Update the quotation record
    const updateQuotationSql = `
    UPDATE quotation
    SET buyer = ?, dc_date = ?, vehicle_number = ?, gst_number = ?, dc_number = ?, dc_issue_date = ?
    WHERE id = ?;
`;

await db.run(updateQuotationSql, [
  formData.buyer,
  formData.dc_date,
  formData.vehicle_number,
  formData.gst_number,
  formData.dc_number,
  formData.dc_issue_date,
  quotation_id, // This should come from the request body
]);

    // Delete existing items associated with this quotation_id
    await db.run(`DELETE FROM items WHERE quotation_id = ?`, [quotation_id]);
    console.log("helo",updateQuotationSql)

    const insertItemSql = `
      INSERT INTO items (quotation_id, name, hsn, qty, umoremarks, remarks)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    for (const item of formData.items) {
      await db.run(insertItemSql, [
        quotation_id,
        item.name,
        item.hsn,
        item.qty,
        item.umoremarks,
        item.remarks,
      ]);
    }

    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error during update operation:", error);
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  } finally {
    if (db) {
      await db.close(); // Ensure the database connection is closed
    }
  }
}