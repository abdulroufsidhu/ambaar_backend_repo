import express from "express";
import { PersonController as controller } from "../../controllers/pg";
import { Authenticator } from "../../middleware/pg/authenticator";
import Routes from "../routes";

const router = express.Router();

router.post(Routes.person.create, new controller().createReq);
router.get(Routes.person.get, Authenticator.requireUser, new controller().readReq); // /get?id="testId"
router.patch(
  Routes.person.update,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requireUser,
  new controller().updateReq
);
router.delete(
  Routes.person.remove,
  Authenticator.requireUser,
  Authenticator.requireEmployeement,
  Authenticator.requireUser,
  new controller().deleteReq
); // /remove?id="testId"

export = router;