import { Router } from "express";
import {
  createMachinetype,
  getMachinetypes,
  updateMachinetype,
} from "../controllers/machinetypeController.js";

const router = Router();

// Route to create a new machinetype
router.post("/machinetype", createMachinetype);

// Route to get all machinetypes
router.get("/machinetype", getMachinetypes);

// Route to update an existing machinetype by ID
router.put("/machinetype/:id", updateMachinetype);

export default router;
