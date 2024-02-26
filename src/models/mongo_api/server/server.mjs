import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import users from "./routes/users.mjs";
import invites from "./routes/invites.mjs";
import upload from "./routes/upload.mjs";
import health from "./routes/health.mjs";

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


// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});