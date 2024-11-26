import express from "express";
import { AuthController } from "../controllers/authController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signUp);
router.get("/user",verifyJWT, AuthController.getUser);
router.post("/userData", AuthController.getUserData)
router.post("/gpt4", AuthController.gpt4);

export default router;
