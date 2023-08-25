import express from "express"
import path from "path"
import { config } from "dotenv"
config({ path: path.resolve("./config/.env") })
const app = express()
const port = process.env.PORT
import { connectionDB } from "./DB/connection.js"
import * as allRoutes from "./src/index.routes.js"
import { log } from "console"
app.use(express.json())
connectionDB()
app.use("/uploads", express.static("./uploads"))
app.use("/user", allRoutes.userRouter)
app.use("/task", allRoutes.taskRouter)
app.use("*", (req, res, next) =>
  res.status(404).json({ message: "404 not found" })
)

// handels all multer errors even when not calling Error class?"change Fieldname"

app.use((err, req, res, next) => {
  if (err) {
    return res.status(err["cause"] || 500).json({ message: err.message })
  }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
