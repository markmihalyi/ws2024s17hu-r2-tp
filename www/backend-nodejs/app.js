import express from "express";
import cors from "cors";
import mainRouter from "./routers/mainRouter.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.get("*", (req, res) => {
  return res.status(404).json({ message: "Not found" });
});

const PORT = 80;
app.listen(PORT, () => {
  console.log("A backend HTTP szerver elindult. Port: " + PORT);
});
