import express from "express";
// import { inventoryController as controller } from "../../controllers/mongo";
import Routes from "./routes";
import { Authenticator } from "../middleware/authenticator";

const router = express.Router();

router.post(
  Routes.inventory.create,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  // controller.createReq
);
router.get(
  Routes.inventory.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  // controller.readReq
); // /get?id="testId"
router.patch(
  Routes.inventory.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  // controller.updateReq
);

export = router;
