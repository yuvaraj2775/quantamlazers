import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

// Function to open the database
async function opendb() {
  try {
    return await open({
      filename: "./Company.db",
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.error("Error opening the database:", e);
    throw e;
  }
}

// Function to initialize the database tables (if not already created)
async function initdb() {
  try {
    const db = await opendb();
    await db.run(`
      CREATE TABLE IF NOT EXISTS company_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        companyname TEXT,
        gstno TEXT,
        is_Delivery_add_enabled INTEGER DEFAULT 0,
        street1 TEXT,
        street2 TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        email TEXT,
        pin TEXT,
        name1 TEXT,
        designation1 TEXT,
        phoneno1 TEXT,
        name2 TEXT,
        designation2 TEXT,
        phoneno2 TEXT,
        name3 TEXT,
        designation3 TEXT,
        phoneno3 TEXT,
        name4 TEXT,
        designation4 TEXT,
        phoneno4 TEXT
      );
    `);
    await db.run(`
      CREATE TABLE IF NOT EXISTS company_alt_Address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER,
        street1 TEXT,
        street2 TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        email TEXT,
        pin TEXT,
        FOREIGN KEY (company_id) REFERENCES company_details(id)
      );
    `);
    console.log("Tables created successfully");
    await db.close();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// POST API Route
export async function POST(req) {
  let db;
  try {
    // Initialize the database and ensure tables exist
    await initdb();

    const dts = await req.json();
    const {
      companyname,
      gstno,
      street1,
      street2,
      city,
      state,
      country,
      email,
      pin,
      name1,
      designation1,
      phoneno1,
      name2,
      designation2,
      phoneno2,
      name3,
      designation3,
      phoneno3,
      name4,
      designation4,
      phoneno4,
      is_Delivery_add_enabled,
      deliveryinput,
    } = dts;

    // Open the database to insert data
    db = await opendb();

    // Insert into company_details table
    const result = await db.run(
      `INSERT INTO company_details (
        companyname, gstno, is_Delivery_add_enabled, street1, street2, city, state, country, email, pin,
        name1, designation1, phoneno1, name2, designation2, phoneno2, name3, designation3, phoneno3, name4, designation4, phoneno4
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        companyname,
        gstno,
        is_Delivery_add_enabled ? 1 : 0, // Check the checkbox status, convert it to 1 (true) or 0 (false)
        street1,
        street2,
        city,
        state,
        country,
        email,
        pin,
        name1,
        designation1,
        phoneno1,
        name2,
        designation2,
        phoneno2,
        name3,
        designation3,
        phoneno3,
        name4,
        designation4,
        phoneno4,
      ]
    );

    // If Delivery Address is enabled, insert the data into company_alt_Address
    if (is_Delivery_add_enabled) {
      const { Street1, Street2, City, State, Country, Email, Pin } = deliveryinput; // Access the deliveryinput fields

      await db.run(
        `INSERT INTO company_alt_Address (
          company_id, street1, street2, city, state, country, email, pin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          result.lastID, // the ID of the inserted company_details record
           Street1,
          Street2,
          City,
          State,
          Country,
          Email,
          Pin,
        ]
      );
    }

    // Close the database connection
    await db.close();

    return NextResponse.json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ message: "Error saving data", error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  let db;
  try {
    db = await opendb();

    // Query to fetch all companies with basic details
    const companyDetails = await db.all(`SELECT * FROM company_details`);
    const companyAltAddresses = await db.all(`SELECT * FROM company_alt_Address`);

    // For each company, if delivery address is enabled, fetch delivery address details
    const companiesWithDeliveryAddress = await Promise.all(
      companyDetails.map(async (company) => {
        if (company.is_Delivery_add_enabled) {
          const altAddress = await db.get(
            `SELECT * FROM company_alt_Address WHERE company_id = ?`,
            company.id
          );
          return { ...company, deliveryAddress: altAddress || null };
        }
        return { ...company, deliveryAddress: null };
      })
    );

    // Close the database connection
    await db.close();

    // Return both company details and company alternate addresses in the response
    return NextResponse.json({
      companiesWithDeliveryAddress, // List of companies with delivery address if enabled
      companyAltAddresses, // List of company alternate addresses
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    if (db) await db.close();
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  let db;
  try {
    const data = await req.json();
    const {
      id, // Company ID to identify the row
      companyname,
      gstno,
      is_Delivery_add_enabled,
      street1,
      street2,
      city,
      state,
      country,
      email,
      pin,
      name1,
      designation1,
      phoneno1,
      name2,
      designation2,
      phoneno2,
      name3,
      designation3,
      phoneno3,
      name4,
      designation4,
      phoneno4
    } = data;

    // Open the database to perform the update operation
    db = await opendb();

    // Update the company details using the provided ID
    const result = await db.run(
      `UPDATE company_details
       SET companyname = ?, gstno = ?, is_Delivery_add_enabled = ?, street1 = ?, street2 = ?, 
           city = ?, state = ?, country = ?, email = ?, pin = ?, name1 = ?, designation1 = ?, 
           phoneno1 = ?, name2 = ?, designation2 = ?, phoneno2 = ?, name3 = ?, designation3 = ?, 
           phoneno3 = ?, name4 = ?, designation4 = ?, phoneno4 = ?
       WHERE id = ?`, 
      [
        companyname,
        gstno,
        is_Delivery_add_enabled ? 1 : 0, // Convert the boolean to integer (1 for true, 0 for false)
        street1,
        street2,
        city,
        state,
        country,
        email,
        pin,
        name1,
        designation1,
        phoneno1,
        name2,
        designation2,
        phoneno2,
        name3,
        designation3,
        phoneno3,
        name4,
        designation4,
        phoneno4,
        id, // Ensure the ID is passed to update the correct row
      ]
    );

    // If the delivery address is enabled, update the delivery address
    if (is_Delivery_add_enabled) {
      await db.run(
        `INSERT OR REPLACE INTO company_alt_Address (
          company_id, street1, street2, city, state, country, email, pin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

        [
          id, // Use the same ID to associate the alt address with the company
          street1,
          street2,
          city,
          state,
          country,
          email,
          pin,
        ]
      );
    } else {
      // If delivery address is not enabled, you might want to delete the alternate address
      await db.run(
        `DELETE FROM company_alt_Address WHERE company_id = ?`,
        [id]
      );
    }

    // Close the database connection
    await db.close();

    return NextResponse.json({ message: "Data updated successfully!" });
  } catch (error) {
    console.error("Error in PUT request:", error);
    if (db) await db.close();
    return NextResponse.json({ message: "Error updating data", error: error.message }, { status: 500 });
  }
}




