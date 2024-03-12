import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import users from "./routes/users.mjs";
import invites from "./routes/invites.mjs";
import upload from "./routes/upload.mjs";
import { db, client } from './db/conn.mjs';
import { ObjectId } from "mongodb";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", users);
app.use("/api/invites", invites);
app.use("/api/upload", upload);
app.use("/api/health", upload);


app.get('/status', (req, res) => {
  res.status(200).send('API is up and running');
});

app.get('/health', async (req, res) => {
  try {
    // Försök ansluta till databasen
    await client.connect();

    // Använd findOne för att testa databasanslutningen
    const collection = db.collection("users");
    const user = await collection.findOne({});

    if (user) {
      res.status(200).send('Database connection is healthy');
    } else {
      res.status(200).send('Database connection is healthy but no users found');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Database connection failed');
  } finally {
    // Stäng anslutningen efter kontrollen
    await client.close();
  }
});




// start the Express server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});