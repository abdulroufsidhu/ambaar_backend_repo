import express from "express";
import { employeeController as controller } from "../../controllers/mongo";
import { Authenticator } from "../../middleware/authenticator";
import Routes from "../routes";

const router = express.Router();

router.post(
  Routes.employees.create,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.createReq
);

router.get(
  Routes.employees.base,
  Authenticator.requireUser,
  Authenticator.requireSelf,
  controller.readReq
)

router.get(
  Routes.employees.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.readReq
); // /get?id="testId"
router.patch(
  Routes.employees.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.updateReq
);
router.delete(
  Routes.employees.remove,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.removeReq
); // /remove?id="testId"

export = router;
