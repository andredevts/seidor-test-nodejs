import { Router } from "express";
import { DriverController } from "../controllers/driver.controller";

const router = Router();

router.post("/", DriverController.createDriver);
router.get("/", DriverController.listAll);
router.get("/:id", DriverController.getDriver);
router.put("/:id", DriverController.updateDriver);
router.delete("/:id", DriverController.deleteDriver);

export default router;
