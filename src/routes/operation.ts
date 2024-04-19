import express from "express";
// import { operationController as controller } from "../../controllers/mongo";
import Routes from "./routes";
import { Authenticator } from "../middleware/authenticator";

const router = express.Router();

router.post(
  Routes.operation.create,
  Authenticator.requireEmployeement,
  // controller.createReq
);
router.get(
  Routes.operation.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  // controller.readReq
); // /get?id="testId"
router.patch(
  Routes.operation.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  // controller.updateReq
);

export = router;
