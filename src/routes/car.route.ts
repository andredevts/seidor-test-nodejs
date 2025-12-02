import { Router } from "express";
import { CarController } from "../controllers/car.controller";

const router = Router();

router.post("/", CarController.createCar);
router.get("/", CarController.listAll);
router.get("/:id", CarController.getCarById);
router.put("/:id", CarController.updateCar);
router.delete("/:id", CarController.deleteCar);

export default router;
