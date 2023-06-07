const express = require("express");

const authController = require('../../controllers/auth-controller');

const { authenticate } = require("../../middlewares")

const { validateBody } = require("../../decorators/validateBody");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), authController.register);

router.post("/login", validateBody(schemas.loginSchema), authController.login);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

module.exports = router;