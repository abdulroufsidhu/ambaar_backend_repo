import express from "express";
import { userController as controller } from "../controllers";

const router = express.Router();

router.post("/create", controller.createReq);
router.get("/get", controller.readReq); // /get?email="test@example.com"&password="test_password"
router.patch("/update", controller.updateReq);
router.delete("/remove", controller.removeReq);// /remove?id="qwerr213423d"
router.patch("/change-password", controller.changePassword);

export = router;
