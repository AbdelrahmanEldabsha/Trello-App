import { Router } from "express"
import * as uc from "./user.controller.js"
import { asyncHandler } from "../../utils/errorHandler.js"
import { isAuth } from "../../middlewares/authentication.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
import {
  changePasswordSchema,
  signInSchema,
  signUpSchema,
  updateUserSchema,
} from "./user.validation.schema.js"
import { multerLocal } from "../../Services/multerLocal.js"
import { multerCloud } from "../../Services/multerCloud.js"
import allowedExtensions from "../../utils/allowedExtensions.js"

const userRouter = Router()

userRouter.post(
  "/signup",
  validationCoreFunction(signUpSchema),
  asyncHandler(uc.signUp)
)
userRouter.get("/confirmEmail/:token", asyncHandler(uc.confirmEmail))
userRouter.get(
  "/signIn",
  validationCoreFunction(signInSchema),
  asyncHandler(uc.signIn)
)
userRouter.patch(
  "/changePassword",
  isAuth(),
  validationCoreFunction(changePasswordSchema),
  asyncHandler(uc.changePassword)
)
userRouter.put(
  "/updateUser",
  isAuth(),
  validationCoreFunction(updateUserSchema),
  asyncHandler(uc.updateUser)
)
userRouter.patch("/softDelete", isAuth(), asyncHandler(uc.softDelete))
userRouter.delete("/deleteUser", isAuth(), asyncHandler(uc.deleteUser))
userRouter.post(
  "/profilePicture",
  multerCloud(allowedExtensions.Image).single("first"),
  isAuth(),
  asyncHandler(uc.profilePicture)
)
userRouter.post(
  "/coverPicture",
  multerCloud(allowedExtensions.Image).array("first"),
  isAuth(),
  asyncHandler(uc.coverPicture)
)

userRouter.get("/logOut", isAuth(), asyncHandler(uc.logOut))
export default userRouter
