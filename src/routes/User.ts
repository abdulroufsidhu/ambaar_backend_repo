import express from "express";
import controller from "../controllers/User";

const router = express.Router();

router.post("/create", controller.createReq);
router.get("/get", controller.readReq); // /get?email="test@example.com"&password="test_password"
router.patch("/update", controller.updateReq);
router.delete("/remove", controller.removeReq);// /remove?id="qwerr213423d"

export = router;
