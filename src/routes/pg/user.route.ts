import express from "express";
import Routes from "../routes";
import controller from "../../controllers/pg/user.controller";
import { Authenticator } from "../../middleware/pg/authenticator";

const router = express.Router();

router.post(Routes.user.create, controller.createReq);
router.get(Routes.user.get, controller.readReq); // /get?email="test@example.com"&password="test_password"
router.patch(Routes.user.update, Authenticator.requireUser, Authenticator.requireSelf, controller.updateReq);
router.delete(Routes.user.remove, Authenticator.requireUser, Authenticator.requireSelf, controller.deleteReq);// /remove?id="qwerr213423d"
router.patch(Routes.user.changePassword, Authenticator.requireUser, Authenticator.requireSelf, controller.changePasswordReq);

export = router;