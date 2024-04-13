import express from "express";
import Routes from "../routes";
import { UserController as controller } from "../../controllers/pg";
import { Authenticator } from "../../middleware/pg/authenticator";

const router = express.Router();

router.post(Routes.user.create, new controller().createReq);
router.get(Routes.user.get, new controller().readReq); // /get?email="test@example.com"&password="test_password"
router.patch(Routes.user.update, Authenticator.requireUser, Authenticator.requireSelf, new controller().updateReq);
router.delete(Routes.user.remove, Authenticator.requireUser, Authenticator.requireSelf, new controller().deleteReq);// /remove?id="qwerr213423d"
router.patch(Routes.user.changePassword, Authenticator.requireUser, Authenticator.requireSelf, new controller().changePasswordReq);

export = router;