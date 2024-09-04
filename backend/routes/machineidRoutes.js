import { Router } from "express";
import {
  createMachineID,
  getMachineIDs,
  updateMachineID,
} from "../controllers/machineidController.js";

const router = Router();

router.post("/machineid", createMachineID);
router.get("/machineid", getMachineIDs);
router.put("/machineid/:id", updateMachineID);

export default router;
