import express from "express";
import controller from "../controllers/Person";

const router = express.Router();

router.post("/create", controller.createReq);
router.get("/get/:personId", controller.readReq);
router.patch("/update", controller.updateReq);
router.delete("/remove/:personId", controller.removeReq);

export = router;
