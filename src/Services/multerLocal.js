import multer from "multer"
import { customAlphabet } from "nanoid"
import path from "path"
import fs from "fs"
import allowedExtensions from "../utils/allowedExtensions.js"
const nanoid = customAlphabet("123456789_abcdefg", 5)
export const multerLocal = (allowedExtensionsArr, customPath) => {
  if (!allowedExtensionsArr) {
    allowedExtensionsArr = allowedExtensions.Image
  }
  if (!customPath) {
    customPath = "General"
  }

  const filePath = path.resolve(`uploads/${customPath}`)
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true })
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, filePath)
    },
    filename: function (req, file, cb) {
      const uniqeName = nanoid() + file.originalname
      cb(null, uniqeName)
    },
  })
  const fileFilter = function (req, file, cb) {
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true)
    }
    cb(new Error("Invalid Extension", { cause: 400 }), false)
  }
  const fileUpload = multer({
    fileFilter,
    storage,

    // limits,
  })
  return fileUpload
}
