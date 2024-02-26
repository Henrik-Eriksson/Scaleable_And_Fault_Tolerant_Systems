import express from "express";
import { db, client } from '../db/conn.mjs';
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Försök ansluta till databasen
    await client.connect();

    // Hämtar serverns status
    const serverStatus = await db.command({ serverStatus: 1 });

    if (serverStatus) {
      res.status(200).send('Database connection is healthy');
    } else {
      res.status(500).send('Database connection is not healthy');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Database connection failed');
  } finally {
    // Stäng anslutningen efter kontrollen
    await client.close();
  }
});

export default router;
