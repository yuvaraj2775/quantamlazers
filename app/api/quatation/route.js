import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

async function opendb() {
  try {
    return await open({
      filename: "./quo.db",
      driver: sqlite3.Database,
    });
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
        subject TEXT,   
        packageCharges REAL,
        transportCharges REAL,
        discount REAL,
        otherCosts REAL,
        term1 TEXT,
        term2 TEXT,
        term3 TEXT,
        term4 TEXT,
         grandTotal INTEGER
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
        typeoftax REAL,
        unitCost REAL
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
      packages,
      transport,
      discount,
      othercost,
      term1,
      term2,
      term3,
      term4,
      grandTotal,
      items,
    } = dts;

  

    db = await opendb();

    const insertQuotation = `
      INSERT INTO quatationform 
      (Address, Date, gstnumber, kindattention, reference, subject, packageCharges, transportCharges, discount, otherCosts,term1,term2,term3,term4 ,grandTotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.run(insertQuotation, [
      Address,
      Date,
      gstnumber,
      kindattention,
      reference,
      subject,
      packages,
      transport,
      discount,
      othercost,
      term1,
      term2,
      term3,
       term4,
       grandTotal
    ]);
    const quotationId = result.lastID;

    const insertItems = `
      INSERT INTO quoitems 
      (Quotation_id, description, hsncode, qty, unit, taxableValue, taxtype, percentage, taxamt, percentage2, taxamt2, typeoftax,unitCost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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
        item.typeoftax,
        item.unitCost
      ]);
    }

    console.log("Inserted quotation and items successfully");
    return NextResponse.json({
      message: "Data inserted successfully",
      quotationId,
    });
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

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  let db;

  try {
    db = await opendb();

    let data;
    let itemdata = [];

    if (id) {
      const selectsql = `SELECT * FROM quatationform WHERE id = ?`;
      data = await db.get(selectsql, id); // Use db.get for single record

      if (!data) {
        return NextResponse.json(
          { error: "Quotation not found" },
          { status: 404 }
        );
      }
      const selectsql2 = `SELECT * FROM quoitems WHERE Quotation_id = ?`;
      itemdata = await db.all(selectsql2, id); // Use db.all for multiple records
    } else {
      const selectsql = `SELECT * FROM quatationform ORDER BY id DESC`;
      data = await db.all(selectsql); // Use db.all for all records
      itemdata = await db.all(`SELECT * FROM quoitems`);
    }

    return NextResponse.json({ data, itemdata });
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

export async function PUT(req) {
  let db;
  try {
    const data = await req.json();
    console.log("Received data:", data);

    const { quotationId, grandTotal, ...formdata } = data; // Destructure grandTotal

    db = await opendb();
    await db.run("BEGIN TRANSACTION");

    const updateQuotationSql = `
      UPDATE quatationform 
      SET Address = ?, Date = ?, gstnumber = ?, kindattention = ?, 
          reference = ?, subject = ?, packageCharges = ?, 
          transportCharges = ?, discount = ?, otherCosts = ?, 
          term1 = ?, term2 = ?, term3 = ?, term4 = ?, 
          grandTotal = ?  -- Add this line to update grandTotal
      WHERE id = ?
    `;

    await db.run(updateQuotationSql, [
      formdata.Address,
      formdata.Date,
      formdata.gstnumber,
      formdata.kindattention,
      formdata.reference,
      formdata.subject,
      formdata.packageCharges,
      formdata.transportCharges,
      formdata.discount,
      formdata.otherCosts,
      formdata.term1,
      formdata.term2,
      formdata.term3,
      formdata.term4,
      grandTotal,  // Include grandTotal here
      quotationId,
    ]);

    await db.run(`DELETE FROM quoitems WHERE Quotation_id = ?`, [quotationId]);
    console.log("Deleted previous items for quotation:", quotationId);

    const insertItems = `
      INSERT INTO quoitems 
      (Quotation_id, description, hsncode, qty, unit, taxableValue, taxtype, 
      percentage, taxamt, percentage2, taxamt2, typeoftax, unitCost) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await Promise.all(formdata.items.map(item => 
      db.run(insertItems, [
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
        item.typeoftax,
        item.unitCost,
      ])
    ));

    await db.run("COMMIT");
    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error during operation:", error);
    await db.run("ROLLBACK");
    return NextResponse.json({ error: "Database error: " + error.message });
  } finally {
    if (db) {
      await db.close();
      console.log("Closed the database"); 
    }
  }
}








