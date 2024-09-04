import { Router } from "express";
import {
  createMachineGroup,
  getMachineGroups,
  updateMachineGroup,
} from "../controllers/machinegroupController.js";

const router = Router();

router.post("/machinegroup", createMachineGroup);
router.get("/machinegroup", getMachineGroups);
router.put("/machinegroup/:id", updateMachineGroup);

export default router;
