import { Router } from "express";
import {
  createMachineRecord,
  getMachineRecords,
  updateMachineRecord,
} from "../controllers/machinerecordsController.js";

const router = Router();

router.post("/machinerecords", createMachineRecord);
router.get("/machinerecords", getMachineRecords);
router.put("/machinerecords/:id", updateMachineRecord);

export default router;
