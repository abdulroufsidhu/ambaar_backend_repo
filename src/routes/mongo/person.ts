import express from "express";
import { personController as controller } from "../../controllers/mongo";
import { Authenticator } from "../../middleware/mongo/authenticator";
import Routes from "../routes";

const router = express.Router();

router.post(Routes.person.create, controller.createReq);
router.get(Routes.person.get, Authenticator.requireUser, controller.readReq); // /get?id="testId"
router.patch(
  Routes.person.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requireUser,
  controller.updateReq
);
router.delete(
  Routes.person.remove,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requireUser,
  controller.removeReq
); // /remove?id="testId"

export = router;
