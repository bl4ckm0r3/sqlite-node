import express from "express";
import sqlite from "sqlite";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;
const dbPromise = sqlite.open("./database.sqlite", { Promise });

app.use(bodyParser.json());

app.get("/answers/", async (_, res) => {
  try {
    const db = await dbPromise;
    const answers = await db.all("SELECT * FROM Answers");
    res.json({ answers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.get("/answers/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const answers = await db.get(
      "SELECT * FROM Answers WHERE id = ?",
      parseInt(req.params.id)
    );
    res.json({ answers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.post("/answers", async (req, res) => {
  try {
    const db = await dbPromise;
    const { copy, answer } = req.body;
    console.log(copy, answer);
    await db.run("CREATE TABLE IF NOT EXISTS answers(id integer PRIMARY KEY, copy text NOT NULL, answer text NOT NULL)");
    await db.run("INSERT INTO answers (copy, answer) VALUES (?, ?)", copy, answer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
  res.json(req.body);
});

app.listen(port);
