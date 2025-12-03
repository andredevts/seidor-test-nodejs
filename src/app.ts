import express from "express";
import carRouter from "./routes/car.route";
import driverRouter from "./routes/driver.route";
import tripRouter from "./routes/trip.route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/cars", carRouter);
app.use("/drivers", driverRouter);
app.use("/trips", tripRouter);

export default app;
