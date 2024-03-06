import express from "express";
import { businessController as controller } from "../../controllers/mongo";
import { Authenticator } from "../../middleware/authenticator";
import Routes from "../routes";

const router = express.Router();

router.post(Routes.businesses.create, Authenticator.requireUser, controller.createReq);
router.get(
  Routes.businesses.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.readReq
); // /get?id="testId"
router.patch(
  Routes.businesses.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.updateReq
);
router.delete(
  Routes.businesses.remove,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.removeReq
); // /remove?id="testId"

export = router;
