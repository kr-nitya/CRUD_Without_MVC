import * as express from "express";
import connection from "./connection";
//import * as bodyParser from "body-parser";
import bodyParser from "body-parser";
const app: express.Application = express.default();
const port: number = 3000;

app.use(bodyParser.json()); // Use body-parser middleware to parse JSON request bodies
//Select
app.get("/read", (req: any, res: any) => {
  const sql: string = "select * from customer";
  connection.query(sql, (err: any, result: any) => {
    console.log(result);
    res.json(result);
  });
});
//Update
app.put("/update/:name/:address", (req: any, res: any) => {
  const username: string = req.params.name;
  const address: string = req.params.address;
  const sql: string = "update customer set address = ? where name = ?";
  connection.query(sql, [address, username], (err: any, result: any) => {
    if (err) {
      console.error("Error updating address:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Name not found" });
      return;
    } else {
      res.json({ message: "Address updated successfully" });
    }
  });
});
//Delete
app.delete("/delete/:name", (req: any, res: any) => {
  const username: string = req.params.name;
  const sql: string = "delete from customer where name = ?";
  connection.query(sql, [username], (err: any, result: any) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Name not found" });
      return;
    } else {
      const deletedRows: string = result.affectedRows;
      res.json({ message: `Deleted ${deletedRows} row(s) successfully` });
    }
  });
});
//Insert
app.post("/insert", (req: any, res: any) => {
  const { name, address } = req.body; //JSON data
  if (!name || !address) {
    res.status(400).json({ error: "Name and address are required" });
    return;
  }

  const sql: string = "INSERT INTO customer (name, address) VALUES (?, ?)";

  connection.query(sql, [name, address], (err: any, result: any) => {
    if (err) {
      console.error("Error inserting row:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({
      message: "Row inserted successfully",
      insertedId: result.insertId,
    });
  });
});
app.listen(port, () => {
  console.log("Server start");
});
