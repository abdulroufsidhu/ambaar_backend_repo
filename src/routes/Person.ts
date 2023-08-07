import express from "express";
import controller from "../controllers/Person";

const router = express.Router();

router.post("/create", controller.createReq);
router.get("/get", controller.readReq); // /get?id="testId"
router.patch("/update", controller.updateReq);
router.delete("/remove", controller.removeReq); // /remove?id="testId"

export = router;
