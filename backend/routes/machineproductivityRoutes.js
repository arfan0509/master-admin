import { Router } from "express";
import {
  createMachineProductivity,
  getMachineProductivity,
  updateMachineProductivity,
} from "../controllers/machineproductivityController.js";

const router = Router();

router.post("/machineproductivity", createMachineProductivity);
router.get("/machineproductivity", getMachineProductivity);
router.put("/machineproductivity/:id", updateMachineProductivity);

export default router;
