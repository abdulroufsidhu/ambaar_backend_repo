import express from "express";
import Routes from "../routes";
import controller from "../../controllers/pg/user.controller";

const router = express.Router();

router.post(Routes.user.create, controller.create);
router.get(Routes.user.get, controller.read); // /get?email="test@example.com"&password="test_password"
router.patch(Routes.user.update, controller.update);
router.delete(Routes.user.remove, controller.delete);// /remove?id="qwerr213423d"
router.patch(Routes.user.changePassword, controller.update);

export = router;