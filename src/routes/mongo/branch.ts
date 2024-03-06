import express from "express";
import { branchController as controller } from "../../controllers/mongo";
import Routes from "../routes";
import { Authenticator } from "../../middleware/authenticator";

const router = express.Router();

router.post(
  Routes.branches.create,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.createReq
);
router.get(
  Routes.branches.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.readReq
); // /get?id="testId"
router.patch(
  Routes.branches.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.updateReq
);
router.delete(
  Routes.branches.remove,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.removeReq
); // /remove?id="testId"

export = router;
