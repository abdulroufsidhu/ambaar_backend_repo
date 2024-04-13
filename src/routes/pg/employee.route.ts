import express from "express";
import { EmployeeController as controller } from "../../controllers/pg";
import { Authenticator } from "../../middleware/pg/authenticator";
import Routes from "../routes";

const router = express.Router();

router.post(
	Routes.employees.create,
	Authenticator.requireUser,
	new controller().createReq
);
router.get(
	Routes.employees.get,
	Authenticator.requireUser,
	Authenticator.requireEmployeement,
	Authenticator.requirePermission,
	new controller().readReq
); // /get?id="testId"
router.patch(
	Routes.employees.update,
	Authenticator.requireUser,
	Authenticator.requireEmployeement,
	Authenticator.requirePermission,
	new controller().updateReq
);
router.delete(
	Routes.employees.remove,
	Authenticator.requireUser,
	Authenticator.requireEmployeement,
	Authenticator.requirePermission,
	new controller().deleteReq
); // /remove?id="testId"

export = router;