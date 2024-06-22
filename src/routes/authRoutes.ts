import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handelInputsErros } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El Nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Los passwords no son iguales");
    }
    return true;
  }),
  body("email").isEmail().withMessage("E-mail no válido"),
  handelInputsErros,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El Token no puede ir vacio"),
  handelInputsErros,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password").notEmpty().withMessage("El password no puede ir vacio"),
  handelInputsErros,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("E-mail no válido"),
  handelInputsErros,
  AuthController.requestConfirmationCode
);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("E-mail no válido"),
  handelInputsErros,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El Token no puede ir vacio"),
  handelInputsErros,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Los passwords no son iguales");
    }
    return true;
  }),
  handelInputsErros,
  AuthController.upadtePasswordWithToken
);

router.get("/user", authenticate, AuthController.user);

router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("El Nombre no puede ir vacio"),
  body("email").isEmail().withMessage("E-mail no válido"),
  handelInputsErros,
  AuthController.updateProfile
);

router.post(
  "/update-password",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Los passwords no son iguales");
    }
    return true;
  }),
  handelInputsErros,
  AuthController.updateCurrentUserPassword
);

router.post(
  "/check-password",
  authenticate,
  body("password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacio"),
  handelInputsErros,
  AuthController.checkPassword
);

export default router;
