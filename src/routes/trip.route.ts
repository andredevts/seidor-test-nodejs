import { Router } from "express";
import { TripController } from "../controllers/trip.controller";

const router = Router();

router.post("/", TripController.createTrip);
router.post("/:id/finish", TripController.finishTrip);
router.get("/", TripController.listAll);
router.get("/:id", TripController.getTripById);

export default router;
