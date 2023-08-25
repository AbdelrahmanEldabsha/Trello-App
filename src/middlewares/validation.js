import joi from "joi"

const reqMethods = ["body", "query", "params", "headers", "file", "files"]
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      "string.pattern.base": "Password regex fail",
    })
    .required(),
}
export const validationCoreFunction = (schema) => {
  try {
    return (req, res, next) => {
      const validationErrorArr = []
      for (const key of reqMethods) {
        if (schema[key]) {
          const validationResult = schema[key].validate(req[key], {
            abortEarly: false,
          })
          if (validationResult.error) {
            validationErrorArr.push(validationResult.error.details)
          }
        }
      }
      if (validationErrorArr.length) {
        return res
          .status(400)
          .json({ message: "Validation error", Errors: validationErrorArr })
      }
      next()
    }
  } catch (err) {
    console.log(err)
  }
}     
