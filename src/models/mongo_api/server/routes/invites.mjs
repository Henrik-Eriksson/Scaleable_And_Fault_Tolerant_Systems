import express from "express";
import {db} from "../db/conn.mjs";
import { ObjectId } from "mongodb";

//   http://20.45.152.9:5050/api/invites/ 
//CRUD
//CREATE
const router = express.Router();
router.post("/createInvite", async (req, res) => {
  let collection = await db.collection("invites");
  try {
    let result = await collection.insertOne(req.body);
    if (result.acknowledged) {
      res.status(200).send({ message: "Invite added successfully" });
    } else {
      res.status(500).send({ message: "Failed to add invite" });
    }
  } catch (error) {
    console.error("Error inserting invite:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//GET ALL INVITES
router.get("/invites", async (req, res) => {
  let collection = await db.collection("invites");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});


//GET SINGLE INVITE BY ID
router.get("/invite/:id", async (req, res) => {
  let collection = await db.collection("invites");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);
  if (!result) res.send("Invite not found").status(404);
  else res.send(result).status(200);
});

//UPDATE INVITE BY ID
router.patch("/invite/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = { $set: req.body }; // Update all fields in the request body
  let collection = await db.collection("invites");
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});


// Accept an invite
router.patch("/acceptInvite/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  let collection = await db.collection("invites");
  let invite = await collection.findOne(query);
  if (!invite) {
    return res.status(404).send({ message: "Invite not found" });
  }
  const eventId = invite.eventId; // Assuming your invite has an eventId field
  
  // Now, you can use the eventId for whatever you want, e.g., adding the user to the event attendees list
  
  // After that, remove the invite
  await collection.deleteOne(query);
  res.status(200).send({ message: "Invite accepted and removed", eventId });
});


//DELETE EVENT BY ID
router.delete("/invite/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const collection = await db.collection("invites");
  let result = await collection.deleteOne(query);
  res.send(result).status(200);
});


//GET ALL INVITES FOR USERID (Received Invites)
router.get("/receivedInvites/:userId", async (req, res) => {
  try {
    let collection = await db.collection("invites");
    let query = { invited: req.params.userId };
    let results = await collection.find(query).toArray();
    if (results.length === 0) {
      res.status(200).send([]);
    } else {
      res.status(200).send(results);
    }
  } catch (error) {
    console.error("Error fetching received invites:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//GET ALL SENT INVITES FROM USERID
router.get("/sentInvites/:userId", async (req, res) => {
  try {
    let collection = await db.collection("invites");
    let query = { inviter: new ObjectId(req.params.userId) };
    let results = await collection.find(query).toArray();
    if (results.length === 0) {
      res.status(404).send("No invites sent by this user");
    } else {
      res.status(200).send(results);
    }
  } catch (error) {
    console.error("Error fetching sent invites:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});


export default router;