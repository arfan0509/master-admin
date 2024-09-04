import { Router } from "express";
import {
  createMachineProfile,
  getMachineProfiles,
  updateMachineProfile,
  getMachineProfileById,
} from "../controllers/machineprofileController.js";

const router = Router();

router.post("/machineprofile", createMachineProfile);
router.get("/machineprofile", getMachineProfiles);
router.get("/machineprofile/:id", getMachineProfileById);
router.put("/machineprofile/:id", updateMachineProfile);

export default router;
