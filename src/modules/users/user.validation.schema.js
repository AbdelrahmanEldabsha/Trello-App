import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"
export const signUpSchema = {
  body: joi
    .object({
      username: joi
        .string()
        .min(3)
        .max(55)
        .required()
        .messages({ "any.required": "username is required" }),
      email: generalFields.email,
      password: generalFields.password,
      cpassword: joi.valid(joi.ref("password")).required(),
      gender: joi.string().optional(),
      phone: joi.string().regex(/^(\+2|002)*01[0125][0-9]{8}$/),
      age: joi.number().min(15).max(65).optional(),
    })
    .required(),
}
export const signInSchema = {
  body: joi
    .object({
      email: generalFields.email,
      password: generalFields.password,
    })
    .options({ presence: "required" })
    .required(),
}
export const changePasswordSchema = {
  body: joi
    .object({
      oldPassword: generalFields.password,
      newPassword: generalFields.password,
      cnewPassword: joi.valid(joi.ref("newPassword")),
    })
    .options({ presence: "required" })
    .required(),
}

export const updateUserSchema = {
  body: joi
    .object({
      age: joi.number().min(15).max(65).optional(),
      firstName: joi.string().min(3).max(29).required(),
      lastName: joi.string().max(25).optional(),
    })
    .required(),
}
