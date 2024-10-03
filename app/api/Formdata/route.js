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
        quotation_id INTEGER
        buyer TEXT,
        dc_date DATE,
        vehicle_number TEXT,
        gst_number TEXT,
        dc_number INT,
        dc_issue_date TEXT,
        ordernumber TEXT,
        orderdate DATE,
      )
    `);
    console.log("Created 'quotation' table");

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
      ordernumber,
      orderdate,
      items,
     
    } = data;

    if (
      !Buyer ||
      !docdate ||
      !vehiclenumber ||
      !gstnumber ||
      !dcnumber ||
      !dcdate ||
      !ordernumber ||
      !orderdate ||
      !items 
      
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await opendb(); 

    
    const insertQuotationSql = `
      INSERT INTO quotation ( buyer, dc_date, vehicle_number, gst_number, dc_number, dc_issue_date, ordernumber,orderdate)
      VALUES (?, ?, ?, ?, ?, ?,?,?);
    `;
    const result = await db.run(insertQuotationSql, [
      Buyer,
      docdate,
      vehiclenumber,
      gstnumber,
      dcnumber,
      dcdate,
      ordernumber,
      orderdate
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
export async function GET(req) {
  const url = new URL(req.url);
  const quotation_id = url.searchParams.get("id"); // Extract quotation_id from query parameters
  let db;

  try {
    db = await opendb(); // Open the database

    let data;
    let itemsData = []; // Initialize itemsData to an empty array

    if (quotation_id) {
      // Fetch specific quotation and its associated items by quotation_id
      const selectSql = `SELECT * FROM quotation WHERE id = ?`;
      data = await db.get(selectSql, [quotation_id]);

      if (!data) {
        return NextResponse.json(
          { error: "Quotation not found" },
          { status: 404 }
        );
      }

      const selectItemsSql = `SELECT * FROM items WHERE quotation_id = ?`;
      itemsData = await db.all(selectItemsSql, [quotation_id]);
    } else {
      // If no quotation_id, fetch all quotations and all items 
      const selectSql = `SELECT * FROM quotation ORDER BY id DESC
      `;
      data = await db.all(selectSql);
      itemsData = await db.all(` SELECT * FROM items `);
    }

    return NextResponse.json({ data: data, data2: itemsData });

  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { error: "Error retrieving data" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close(); // Ensure the database connection is closed
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
    SET buyer = ?, dc_date = ?, vehicle_number = ?, gst_number = ?, dc_number = ?, dc_issue_date = ?, ordernumber=?,orderdate=?
    WHERE id = ?;
`;

await db.run(updateQuotationSql, [
  formData.buyer,
  formData.dc_date,
  formData.vehicle_number,
  formData.gst_number,
  formData.dc_number,
  formData.dc_issue_date,
 formData.ordernumber,
  formData.orderdate,
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
