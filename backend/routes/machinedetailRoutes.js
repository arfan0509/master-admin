import { Router } from "express";
import {
  createMachineDetail,
  getMachineDetails,
  updateMachineDetail,
  getMachineDetailById,
} from "../controllers/machinedetailController.js";

const router = Router();

router.post("/machinedetail", createMachineDetail);
router.get("/machinedetail", getMachineDetails);
router.get("/machinedetail/:id", getMachineDetailById);
router.put("/machinedetail/:id", updateMachineDetail);

export default router;
