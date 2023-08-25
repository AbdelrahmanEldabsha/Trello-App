import * as tc from "./task.controller.js"
import { asyncHandler } from "../../utils/errorHandler.js"
import { isAuth } from "../../middlewares/authentication.js"
import { Router } from "express"

const taskRouter = Router()

taskRouter.post("/addTask", isAuth(), asyncHandler(tc.addTask))
taskRouter.put("/updateTask", isAuth(), asyncHandler(tc.updateTask))
taskRouter.delete("/deleteTask", isAuth(), asyncHandler(tc.deleteTask))
taskRouter.get(
  "/getAllTasksWithUserData",
  isAuth(),
  asyncHandler(tc.getAllTasksWithUserData)
)
taskRouter.get(
  "/getAllCreatedTasks",
  isAuth(),
  asyncHandler(tc.getAllCreatedTasks)
)
taskRouter.get(
  "/getAllTasksAssignedToMe",
  isAuth(),
  asyncHandler(tc.getAllTasksAssignedToMe)
)
taskRouter.get(
  "/getAllLateTasksAssignedByMe",
  isAuth(),
  asyncHandler(tc.getAllLateTasksAssignedByMe)
)
taskRouter.get(
  "/getAllLateTasksAssignedToUser",
  isAuth(),
  asyncHandler(tc.getAllLateTasksAssignedToUser)
)
// userRouter.get("/signIn", asyncHandler(uc.signIn))
// userRouter.patch("/changePassword", isAuth(), asyncHandler(uc.changePassword))
// userRouter.put("/updateUser", isAuth(), asyncHandler(uc.updateUser))
// userRouter.patch("/softDelete", isAuth(), asyncHandler(uc.softDelete))
// userRouter.delete("/deleteUser", isAuth(), asyncHandler(uc.deleteUser))

// userRouter.get("/logOut", isAuth(), asyncHandler(uc.logOut))

export default taskRouter
