import mongoose, { Schema } from "mongoose"
// title , description , status{toDo , doing , done} , userId , assignTo , deadline
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["toDo", "doing", "done"],
      default: "toDo",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const taskModel = mongoose.model("Task", taskSchema)
