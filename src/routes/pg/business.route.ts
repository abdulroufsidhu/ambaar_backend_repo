import express from "express";
import { BusinessController as controller } from "../../controllers/pg";
import { Authenticator } from "../../middleware/pg/authenticator";
import Routes from "../routes";

const router = express.Router();

router.post(
	Routes.businesses.create,
	Authenticator.requireUser,
	new controller().createReq
);
router.get(
	Routes.businesses.get,
	Authenticator.requireUser,
	Authenticator.requireEmployeement,
	Authenticator.requirePermission,
	new controller().readReq
); // /get?id="testId"
router.patch(
	Routes.businesses.update,
	Authenticator.requireUser,
	Authenticator.requireEmployeement,
	Authenticator.requirePermission,
	new controller().updateReq
);
router.delete(
	Routes.businesses.remove,
	Authenticator.requireUser,
	Authenticator.requireEmployeement,
	Authenticator.requirePermission,
	new controller().deleteReq
); // /remove?id="testId"

export = router;
