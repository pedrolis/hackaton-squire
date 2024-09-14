import { Router } from "express";
import apiv1 from "./v1/index.js";

// this serves as the root path definition, define root paths here
const router = Router();
router.use("/api/v1", apiv1);

export default router;