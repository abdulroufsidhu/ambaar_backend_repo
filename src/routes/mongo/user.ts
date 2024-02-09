import express from "express";
import { userController as controller } from "../../controllers/mongo";
import { Authenticator } from "../../middleware/authenticator";
import Routes from "./routes";

const router = express.Router();

router.post(Routes.user.create, controller.createReq);
router.get(Routes.user.get, controller.readReq); // /get?email="test@example.com"&password="test_password"
router.patch(Routes.user.update, Authenticator.requireUser, controller.updateReq);
router.delete(Routes.user.remove, Authenticator.requireUser, controller.removeReq);// /remove?id="qwerr213423d"
router.patch(Routes.user.changePassword, Authenticator.requireUser, controller.changePassword);

export = router;
