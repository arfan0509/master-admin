import { Router } from "express";
import { getVendors, getVendorById } from "../controllers/vendorController.js"; // Pastikan path ini benar sesuai dengan struktur project Anda

const router = Router();

router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendorById);

export default router;
