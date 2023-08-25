import { userModel } from "../../../DB/models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmailService } from "../../Services/sendEmailService.js"
import cloudinary from "../../utils/cloudinaryConfig.js"

export const signUp = async (req, res, next) => {
  const { username, email, password, cpassword, gender, phone, age } = req.body
  const isUserExist = await userModel.findOne({ email })
  if (isUserExist) {
    return res.status(400).json({ message: "user already exists" })
  }
  if (password !== cpassword) {
    return res.status(400).json({ message: "password don't match" })
  }
  //ConfirmEmail
  const token = jwt.sign({ email }, process.env.TOKEN_SECRET_KEY)
  const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`
  const message = `<a href=${confirmLink}>Click to confirm your mail</a>`

  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Confirm Email",
    message,
  })
  if (!isEmailSent) {
    return res.status(500).json({ message: "Please try again later" })
  }
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
  const user = new userModel({
    username,
    email,
    password: hashedPassword,
    gender,
    phone,
    age,
  })
  await user.save()
  res.status(201).json({ message: "Done", user, token })
}

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params
  const decodedData = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
  const isConfirmedCheck = await userModel.findOne({ email: decodedData.email })
  if (isConfirmedCheck.isConfirmed) {
    return res.status(400).json({ message: "email is already confirmed" })
  }
  const user = await userModel.findOneAndUpdate(
    { email: decodedData.email },
    { isConfirmed: true },
    {
      new: true,
    }
  )
  res.status(200).json({
    message: "Email Confirmed Successfully, please try to login",
    user,
  })
}
export const signIn = async (req, res, next) => {
  const { email, password } = req.body
  const isUserExist = await userModel.findOne({ email })
  if (!isUserExist) {
    return next(new Error("in-valid login credentails", { cause: 400 }))
    //  res.status(400).json({ message: "in-valid login credentails" })
  }
  const isPassMatch = bcrypt.compareSync(password, isUserExist.password)
  if (!isPassMatch) {
    return res.status(400).json({ message: "in-valid login credentails" })
  }
  const userToken = jwt.sign(
    {
      username: isUserExist.username,
      email,
      id: isUserExist._id,
    },
    process.env.TOKEN_SECRET_KEY
  )
  isUserExist.isOnline = true
  isUserExist.isDeleted = false
  await isUserExist.save()
  res.status(200).json({ message: "User logged in successfully", userToken })
}
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword, cnewPassword } = req.body
  const { _id } = req.authUser
  const updatedUser = await userModel.findById({ _id })
  if (!updatedUser) {
    return res.status(400).json({ message: "please sign up first" })
  }
  if (updatedUser.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!updatedUser.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  const ispassMatch = bcrypt.compareSync(oldPassword, updatedUser.password)
  if (!ispassMatch) {
    return res.status(400).json({ message: "Wrong old password" })
  }
  if (newPassword != cnewPassword) {
    return res.status(400).json({ message: "new password don't match" })
  }
  const newHashedPassword = bcrypt.hashSync(
    newPassword,
    +process.env.SALT_ROUNDS
  )

  updatedUser.password = newHashedPassword

  await updatedUser.save()
  res.status(200).json({ message: "Password changed successfully" })
}
export const updateUser = async (req, res, next) => {
  const { age, firstName, lastName } = req.body
  const { _id } = req.authUser
  const updatedUser = await userModel.findById({ _id })

  const updatedUsername =
    lastName && lastName != " " ? firstName + " " + lastName : firstName
  updatedUser.username = updatedUsername
  updatedUser.age = age
  await updatedUser.save()
  res.status(200).json({ message: "user updated successfully", updatedUser })
}
export const softDelete = async (req, res, next) => {
  const { _id } = req.authUser
  const signedUser = await userModel.findById({ _id })

  signedUser.isDeleted = true
  signedUser.isOnline = false

  await signedUser.save()
  res.status(200).json({ message: "user soft deleted successfully" })
}
export const deleteUser = async (req, res, next) => {
  const { _id } = req.authUser

  const deletedUser = await userModel.deleteOne({ _id })
  res.status(200).json({ message: "user deleted successfully", deletedUser })
}
export const logOut = async (req, res, next) => {
  const { _id } = req.authUser
  const signedUser = await userModel.findById({ _id })
  signedUser.isOnline = false
  await signedUser.save()
  res.status(200).json({ message: "user logged out successfully" })
}

export const profilePicture = async (req, res, next) => {
  const { _id } = req.authUser
  if (!req.file) {
    return next(new Error("Please upload pic again", { cause: 400 }))
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `user/profile/${_id}`,
      // public_id: `${_id}`,
      use_filename: true, //
      unique_filename: "true",
      resource_type: "auto",
    }
  )
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id },
    { profilePic: { secure_url, public_id } },
    { new: true }
  )
  if (!updateUser) {
    await cloudinary.uploader.destroy(public_id)
  }
  res.json({ message: "done", updatedUser })
}

export const coverPicture = async (req, res, next) => {
  const { _id, coverPics } = req.authUser
  if (!req.files) {
    return next(new Error("Please upload pic again", { cause: 400 }))
  }
  const newCoversUrl = []
  console.log(req.files)
  for (let i = 0; i < req.files.length; i++) {
    const data = await cloudinary.uploader.upload(req.files[i].path, {
      folder: `user/covers/${_id}`,
      // public_id: `${_id}`,
      use_filename: true, //
      unique_filename: "true",
      resource_type: "auto",
    })
    const { secure_url, public_id } = data
    console.log(req.files)
    newCoversUrl.push({ secure_url, public_id })
  }

  const pics = [...coverPics, ...newCoversUrl]
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id },
    { coverPics: pics },
    { new: true }
  )

  res.json({ message: "done", user: updatedUser })
}
