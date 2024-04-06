import express from "express";
import { BranchController as controller } from "../../controllers/pg";
import Routes from "../routes";
import { Authenticator } from "../../middleware/pg/authenticator";

const router = express.Router();

router.post(
  Routes.branches.create,
  Authenticator.requireUser,
  new controller().createReq
);
router.get(
  Routes.branches.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  new controller().readReq
); // /get?id="testId"
router.patch(
  Routes.branches.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  new controller().updateReq
);
router.delete(
  Routes.branches.remove,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  new controller().deleteReq
); // /remove?id="testId"

export = router;
