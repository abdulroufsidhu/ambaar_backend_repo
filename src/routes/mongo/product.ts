import express from "express";
import { productController as controller } from "../../controllers/mongo";
import { Authenticator } from "../../middleware/authenticator";
import Routes from "./routes";

const router = express.Router();

router.post(
  Routes.products.create,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.createReq
);
router.get(
  Routes.products.get,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.readReq
); // /get?id="testId"
router.patch(
  Routes.products.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requirePermission,
  controller.updateReq
);

export = router;
