import express from "express";
import controller from "../controllers/User";

const router = express.Router();

router.post("/create", controller.createReq);
router.get("/get/:email", controller.readReq);
router.patch("/update", controller.updateReq);
router.delete("/remove/:uid", controller.removeReq);

export = router;
