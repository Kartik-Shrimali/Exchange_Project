import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const token = jwt.sign({ userId: "mm_bot" }, process.env.JWT_SECRET || "example", { expiresIn: "100y" })
console.log(token)