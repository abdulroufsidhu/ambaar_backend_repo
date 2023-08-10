import express from "express";
import { permissionController as controller } from "../controllers";

const router = express.Router();

router.post("/create", controller.createReq);
router.get("/get", controller.readReq); // /get?id="testId"
router.patch("/update", controller.updateReq);
router.delete("/remove", controller.removeReq); // /remove?id="testId"

export = router;
