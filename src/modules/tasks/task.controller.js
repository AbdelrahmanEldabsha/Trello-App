import { taskModel } from "../../../DB/models/task.model.js"
import { userModel } from "../../../DB/models/user.model.js"
import moment from "moment"

// const userCheck = (user) => {
//   if (!user) {
//     return res.status(400).json({ message: "please sign up first" })
//   }
//   if (user.isDeleted) {
//     return res
//       .status(400)
//       .json({ message: "this email is deleted, please login again" })
//   }
//   if (!user.isOnline) {
//     return res.status(400).json({ message: "please sign in first" })
//   }
// }
export const addTask = async (req, res) => {
  const { _id } = req.authUser
  const { title, description, assignedTo, deadline } = req.body
  const isUserExist = await userModel.findById({ _id })
  const assignedUser = await userModel.findOne({ assignedTo })
  if (!isUserExist) {
    return res.status(400).json({ message: "please sign up first" })
  }
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  if (!assignedUser) {
    return res.status(400).json({ message: "assigned user not found" })
  }
  const dateNow = new moment().format("YYYY-MM-DD")
  const deadlineDate = new moment(deadline).format("YYYY-MM-DD")
  if (deadlineDate < dateNow) {
    console.log(deadlineDate, dateNow)
    return res.status(400).json({ message: "enter valid date" })
  }
  console.log(deadlineDate, dateNow)
  const newTask = new taskModel({
    title,
    description,
    assignedTo,
    userId: _id,
    deadline: deadlineDate,
  })
  await newTask.save()
  res.status(200).json({ message: "task added successfully", newTask })
}
export const updateTask = async (req, res) => {
  const { _id } = req.authUser
  const { taskId } = req.query
  const { title, description, status, assignedTo, deadline } = req.body
  const isUserExist = await userModel.findById({ _id })
  const isTaskExist = await taskModel.findById({ _id: taskId })
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  if (!isTaskExist) {
    return res.status(400).json({ message: "task not found" })
  }
  if (isTaskExist.userId.toString() != _id.toString()) {
    return res.status(400).json({
      message: "you are not allowed to update this task",
      userId: _id,
      isTaskExist: isTaskExist.userId,
    })
  }
  const dateNow = new moment().format("YYYY-MM-DD")
  const deadlineDate = new moment(deadline).format("YYYY-MM-DD")
  if (deadlineDate < dateNow) {
    console.log(deadlineDate, dateNow)
    return res.status(400).json({ message: "enter valid date" })
  }
  isTaskExist.title = title
  isTaskExist.description = description
  isTaskExist.status = status
  isTaskExist.assignedTo = assignedTo
  isTaskExist.deadline = deadline
  await isTaskExist.save()
  res.status(200).json({ message: "task updated successfully", isTaskExist })
}
export const deleteTask = async (req, res) => {
  const { _id } = req.authUser
  const { taskId } = req.query
  const isUserExist = await userModel.findById({ _id })
  const isTaskExist = await taskModel.findById({ _id: taskId })
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  if (!isTaskExist) {
    return res.status(400).json({ message: "task not found" })
  }
  if (isTaskExist.userId.toString() != _id.toString()) {
    return res.status(400).json({
      message: "you are not allowed to delete this task",
    }) 
  }
  const deletedTask = await taskModel.deleteOne({ _id: taskId })
  res.status(200).json({ message: "task deleted successfully", deletedTask })
}

export const getAllTasksWithUserData = async (req, res) => {
  const allTasks = await taskModel.find().populate([
    {
      path: "userId",
      select: "username email",
    },
    {
      path: "assignedTo",
      select: "username email",
    },
  ])
  if (!allTasks.length) {
    return res.status(400).json({ message: "no tasks found" })
  }
  res.status(200).json({ message: " successfully", allTasks })
}
export const getAllCreatedTasks = async (req, res) => {
  const { _id } = req.authUser
  const isUserExist = await userModel.findById({ _id })
  if (!isUserExist) {
    return res.status(400).json({ message: "please sign up first" })
  }
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  const userCreatedTasks = await taskModel.find({ userId: _id }).populate([
    {
      path: "userId assignedTo",
      select: "username email",
    },
  ])
  if (!userCreatedTasks.length) {
    return res.status(400).json({ message: "no tasks found" })
  }
  res.status(200).json({ message: " successfully", userCreatedTasks })
}
export const getAllTasksAssignedToMe = async (req, res) => {
  const { _id } = req.authUser
  const isUserExist = await userModel.findById({ _id })
  if (!isUserExist) {
    return res.status(400).json({ message: "please sign up first" })
  }
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  const userAssignedTasks = await taskModel.find({ assignedTo: _id }).populate([
    {
      path: "userId assignedTo",
      select: "username email",
    },
  ])
  if (!userAssignedTasks.length) {
    return res.status(400).json({ message: "no tasks found" })
  }
  res.status(200).json({ message: " successfully", userAssignedTasks })
}
export const getAllLateTasksAssignedByMe = async (req, res) => {
  const { _id } = req.authUser
  const isUserExist = await userModel.findById({ _id })
  if (!isUserExist) {
    return res.status(400).json({ message: "please sign up first" })
  }
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  const dateNow = new moment().format("YYYY-MM-DD")
  const userLateTasks = await taskModel
    .find({ userId: _id, deadline: { $lt: dateNow } })
    .populate([
      {
        path: "userId assignedTo",
        select: "username email",
      },
    ])
  if (!userLateTasks.length) {
    return res.status(400).json({ message: "no Late tasks found" })
  }
  res.status(200).json({ message: " successfully", userLateTasks })
}

export const getAllLateTasksAssignedToUser = async (req, res) => {
  const { _id } = req.authUser
  const { assignedTo } = req.query
  const isUserExist = await userModel.findById({ _id })
  const isAssignedUserExists = await taskModel.findOne({
    assignedTo,
  })
  if (!isUserExist) {
    return res.status(400).json({ message: "please sign up first" })
  }
  if (isUserExist.isDeleted) {
    return res
      .status(400)
      .json({ message: "this email is deleted, please login again" })
  }
  if (!isUserExist.isOnline) {
    return res.status(400).json({ message: "please sign in first" })
  }
  if (!isAssignedUserExists) {
    return res.status(400).json({ message: "no tasks assigned to this user" })
  }
  const dateNow = new moment().format("YYYY-MM-DD")
  const userLateTasks = await taskModel
    .find({ assignedTo, deadline: { $lt: dateNow } })
    .populate([
      {
        path: "userId assignedTo",
        select: "username email",
      },
    ])
  if (!userLateTasks.length) {
    return res.status(400).json({ message: "no Late tasks found" })
  }
  res.status(200).json({ message: " successfully", userLateTasks })
}
