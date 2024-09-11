import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log("Connection to: " + req.path + " With method: " + req.method);
    next();
});

// Express Routers
import usersRouter from "./routers/users";
import groupsRouter from "./routers/groups";
import votesRouter from "./routers/votes";

app.use("/api/users", usersRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/votes", votesRouter);

// Listen for Express Requests
app.listen(process.env.PORT, () => {
    console.log("Listening on port:", process.env.PORT);
});
