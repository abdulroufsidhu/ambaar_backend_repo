import express from "express";
import { permissionController as controller } from "../controllers";

const router = express.Router();

/**
 * Permission is a complex idea which requires deep thinking and alot of consentration
 * the simplest permissioning I could comeup with is 
 * to store paths into database and check if user is allowed to access that specific path
 * for example /businesses/create is an api path that creates business
 * 	similarly /inventory/update updates it.
 * so the idea is to create the middleware which determines weather the user 
 * has right to access /business/create or /inventory/update forward the request 
 * otherwise return error
 */

router.post("/create", controller.createReq);
router.get("/get", controller.readReq); // /get?id="testId"
router.patch("/update", controller.updateReq);
router.delete("/remove", controller.removeReq); // /remove?id="testId"

export = router;
