import multer from "multer"

export const allowedExtensions = {
  Image: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  Files: ["application/pdf", "application/javascript"],
  Videos: ["video/mp4"],
}
export const multerCloud = (allowedExtensionsArr) => {
  if (!allowedExtensionsArr) {
    allowedExtensionsArr = allowedExtensions.Image
  }

  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      const uniqeName = file.originalname
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
  })
  return fileUpload
}
