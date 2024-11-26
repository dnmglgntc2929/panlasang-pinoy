import express from "express";
import authController from "../../controllers/authenticationController.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signUp);
router.get("/user", authController.getUser);
router.post("/gpt4", authController.gpt4);

module.exports = router;